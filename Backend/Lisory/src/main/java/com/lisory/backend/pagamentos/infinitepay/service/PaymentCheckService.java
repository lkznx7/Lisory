package com.lisory.backend.pagamentos.infinitepay.service;

import com.lisory.backend.pagamentos.entity.Payment;
import com.lisory.backend.pagamentos.infinitepay.dto.InfinitePayPaymentCheckResponse;
import com.lisory.backend.pagamentos.repository.PaymentRepository;
import com.lisory.backend.shared.log.StructuredLogger;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentCheckService {

    private static final StructuredLogger log = StructuredLogger.forClass(PaymentCheckService.class);

    private final InfinitePayService infinitePayService;
    private final PaymentRepository paymentRepository;

    public PaymentCheckService(
            InfinitePayService infinitePayService,
            PaymentRepository paymentRepository
    ) {
        this.infinitePayService = infinitePayService;
        this.paymentRepository = paymentRepository;
    }

    @Scheduled(fixedDelayString = "${infinitepay.check-interval:60000}")
    public void checkPendingPayments() {
        List<Payment> pendingPayments = paymentRepository.findAll().stream()
                .filter(p -> "PENDING".equals(p.getStatus()) || "PROCESSING".equals(p.getStatus()))
                .filter(p -> p.getOrderNSU() != null && !p.getOrderNSU().isBlank())
                .filter(p -> p.getCreatedAt() != null && p.getCreatedAt().isAfter(LocalDateTime.now().minusHours(24)))
                .toList();

        if (pendingPayments.isEmpty()) {
            return;
        }

        log.info("payment_check_batch", Map.of("count", String.valueOf(pendingPayments.size())));

        for (Payment payment : pendingPayments) {
            try {
                checkSinglePayment(payment);
            } catch (Exception e) {
                log.error("payment_check_error", Map.of(
                        "paymentId", payment.getId().toString(),
                        "orderId", payment.getOrder() != null ? payment.getOrder().getId().toString() : "null"
                ), e);
            }
        }
    }

    public InfinitePayPaymentCheckResponse checkPaymentByOrderId(UUID orderId) {
        log.info("payment_check_single", Map.of("orderId", orderId.toString()));
        return infinitePayService.checkPaymentStatus(orderId);
    }

    private void checkSinglePayment(Payment payment) {
        UUID orderId = payment.getOrder() != null ? payment.getOrder().getId() : null;
        if (orderId == null) {
            return;
        }

        InfinitePayPaymentCheckResponse response = infinitePayService.checkPaymentStatus(orderId);

        if (response.paid()) {
            log.info("payment_check_confirmed", Map.of(
                    "orderId", orderId.toString(),
                    "paymentId", payment.getId().toString()
            ));
        } else if (response.error() != null && !response.error().isBlank()) {
            log.warn("payment_check_error_response", Map.of(
                    "orderId", orderId.toString(),
                    "error", response.error()
            ));
        }
    }
}
