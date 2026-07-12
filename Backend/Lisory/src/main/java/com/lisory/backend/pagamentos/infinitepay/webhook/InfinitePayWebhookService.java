package com.lisory.backend.pagamentos.infinitepay.webhook;

import com.lisory.backend.envios.entity.Shipment;
import com.lisory.backend.envios.services.ShipmentService;
import com.lisory.backend.envios.services.ShippingQuote;
import com.lisory.backend.pagamentos.entity.Payment;
import com.lisory.backend.pagamentos.infinitepay.dto.InfinitePayWebhookEvent;
import com.lisory.backend.pagamentos.repository.PaymentRepository;
import com.lisory.backend.pedido.entity.Order;
import com.lisory.backend.pedido.entity.OrderStatus;
import com.lisory.backend.pedido.repository.OrderRepository;
import com.lisory.backend.shared.log.StructuredLogger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class InfinitePayWebhookService {

    private static final StructuredLogger log = StructuredLogger.forClass(InfinitePayWebhookService.class);

    private static final String STATUS_APPROVED = "APPROVED";

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final ShipmentService shipmentService;

    public InfinitePayWebhookService(
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            ShipmentService shipmentService
    ) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.shipmentService = shipmentService;
    }

    @Transactional
    public void processEvent(InfinitePayWebhookEvent event) {
        log.info("infinitepay_webhook_received", Map.of(
                "orderNsu", event.orderNsu() != null ? event.orderNsu() : "null",
                "captureMethod", event.captureMethod() != null ? event.captureMethod() : "null",
                "paidAmount", String.valueOf(event.paidAmount())
        ));

        if (event.orderNsu() == null || event.orderNsu().isBlank()) {
            log.warn("infinitepay_webhook_no_order_nsu", Map.of());
            return;
        }

        UUID orderId;
        try {
            orderId = UUID.fromString(event.orderNsu());
        } catch (IllegalArgumentException e) {
            log.warn("infinitepay_webhook_invalid_order_nsu", Map.of("orderNsu", event.orderNsu()));
            return;
        }

        Payment payment = paymentRepository.findByOrderId(orderId).orElse(null);
        if (payment == null) {
            log.warn("infinitepay_webhook_payment_not_found", Map.of("orderId", orderId.toString()));
            return;
        }

        if (STATUS_APPROVED.equals(payment.getStatus())) {
            log.info("infinitepay_webhook_already_approved", Map.of("orderId", orderId.toString()));
            return;
        }

        payment.setStatus(STATUS_APPROVED);
        payment.setPaidAt(LocalDateTime.now());

        if (event.invoiceSlug() != null) {
            payment.setGatewayId(event.invoiceSlug());
        }
        if (event.transactionNsu() != null) {
            payment.setTransactionNSU(event.transactionNsu());
        }
        if (event.captureMethod() != null) {
            payment.setPaymentMethod(event.captureMethod());
        }
        if (event.receiptUrl() != null) {
            payment.setGatewayPaymentId(event.receiptUrl());
        }
        payment.setInstallments(event.installments());

        paymentRepository.save(payment);

        // Update order status to PAGO
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            if (OrderStatus.AGUARDANDO_PAGAMENTO.name().equals(order.getStatus())) {
                order.setStatus(OrderStatus.PAGO.name());
                orderRepository.save(order);

                // Create default shipment after payment confirmed
                // Real shipment will be created when label is bought via Melhor Envio
                try {
                    shipmentService.createShipment(orderId, new ShippingQuote("PAC", "PAC", BigDecimal.ZERO, 0));
                    log.info("infinitepay_webhook_shipment_created", Map.of("orderId", orderId.toString()));
                } catch (Exception e) {
                    log.error("infinitepay_webhook_shipment_creation_error", Map.of("orderId", orderId.toString()), e);
                }

                log.info("infinitepay_webhook_order_updated", Map.of(
                        "orderId", orderId.toString(),
                        "newStatus", OrderStatus.PAGO.name()
                ));
            }
        }

        log.info("infinitepay_webhook_processed", Map.of(
                "orderId", orderId.toString(),
                "newStatus", STATUS_APPROVED
        ));
    }
}
