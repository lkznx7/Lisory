package com.lisory.backend.pagamentos.infinitepay.service;

import com.lisory.backend.config.properties.InfinitePayProperties;
import com.lisory.backend.pagamentos.entity.Payment;
import com.lisory.backend.pagamentos.infinitepay.client.InfinitePayClient;
import com.lisory.backend.pagamentos.infinitepay.dto.InfinitePayCreateLinkRequest;
import com.lisory.backend.pagamentos.infinitepay.dto.InfinitePayCreateLinkResponse;
import com.lisory.backend.pagamentos.infinitepay.dto.InfinitePayPaymentCheckResponse;
import com.lisory.backend.pagamentos.infinitepay.exception.InfinitePayException;
import com.lisory.backend.pagamentos.repository.PaymentRepository;
import com.lisory.backend.pedido.entity.Order;
import com.lisory.backend.pedido.entity.OrderItem;
import com.lisory.backend.pedido.entity.OrderStatus;
import com.lisory.backend.pedido.repository.OrderRepository;
import com.lisory.backend.shared.log.StructuredLogger;
import com.lisory.backend.shared.util.MoneyUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class InfinitePayService {

    private static final StructuredLogger log = StructuredLogger.forClass(InfinitePayService.class);

    private final InfinitePayClient client;
    private final InfinitePayProperties properties;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    public InfinitePayService(
            InfinitePayClient client,
            InfinitePayProperties properties,
            OrderRepository orderRepository,
            PaymentRepository paymentRepository
    ) {
        this.client = client;
        this.properties = properties;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    public String createPaymentLink(UUID orderId) {
        log.info("infinitepay_create_link_start", Map.of("orderId", orderId.toString()));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new InfinitePayException("Order not found: " + orderId, "ORDER_NOT_FOUND"));

        List<InfinitePayCreateLinkRequest.LinkItem> items = new ArrayList<>();
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                long unitPriceInCents = MoneyUtils.toCents(item.getUnitPrice());
                String productName = item.getProduct() != null ? item.getProduct().getName() : "Item";
                items.add(new InfinitePayCreateLinkRequest.LinkItem(
                        item.getQuantity(),
                        unitPriceInCents,
                        productName
                ));
            }
        }

        if (items.isEmpty()) {
            long totalInCents = MoneyUtils.toCents(order.getTotal());
            items.add(new InfinitePayCreateLinkRequest.LinkItem(
                    1,
                    totalInCents,
                    "Pedido " + orderId
            ));
        }

        InfinitePayCreateLinkRequest request = new InfinitePayCreateLinkRequest(
                properties.handle(),
                properties.redirectUrl(),
                properties.webhookUrl(),
                orderId.toString(),
                items
        );

        InfinitePayCreateLinkResponse response = client.createPaymentLink(request);

        if (response.url() == null || response.url().isBlank()) {
            throw new InfinitePayException("Empty payment URL from InfinitePay", "EMPTY_URL");
        }

        savePaymentRecord(orderId, response.url());

        log.info("infinitepay_create_link_success", Map.of(
                "orderId", orderId.toString(),
                "url", "present"
        ));

        return response.url();
    }

    public InfinitePayPaymentCheckResponse checkPaymentStatus(UUID orderId) {
        log.info("infinitepay_check_status", Map.of("orderId", orderId.toString()));
        InfinitePayPaymentCheckResponse response = client.checkPayment(orderId.toString());

        if (response.paid()) {
            handlePaymentConfirmed(orderId);
        }

        return response;
    }

    @Transactional
    public void handlePaymentConfirmed(UUID orderId) {
        log.info("infinitepay_handle_confirmed", Map.of("orderId", orderId.toString()));

        Payment payment = paymentRepository.findByOrderId(orderId).orElse(null);
        if (payment != null && "APPROVED".equals(payment.getStatus())) {
            log.info("infinitepay_already_approved", Map.of("orderId", orderId.toString()));
            return;
        }

        if (payment == null) {
            payment = new Payment();
            Order orderStub = new Order();
            orderStub.setId(orderId);
            payment.setOrder(orderStub);
            payment.setPaymentMethod("PIX");
            payment.setAmount(BigDecimal.ZERO);
        }

        payment.setStatus("APPROVED");
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        Order order = orderRepository.findById(orderId).orElse(null);
        if (order != null && OrderStatus.AGUARDANDO_PAGAMENTO.name().equals(order.getStatus())) {
            order.setStatus(OrderStatus.PAGO.name());
            orderRepository.save(order);
            log.info("infinitepay_order_status_updated", Map.of(
                    "orderId", orderId.toString(),
                    "newStatus", OrderStatus.PAGO.name()
            ));
        }
    }

    private void savePaymentRecord(UUID orderId, String paymentLink) {
        Payment payment = paymentRepository.findByOrderId(orderId).orElse(null);
        if (payment == null) {
            payment = new Payment();
            Order orderStub = new Order();
            orderStub.setId(orderId);
            payment.setOrder(orderStub);
        }

        Order order = orderRepository.findById(orderId).orElse(null);
        payment.setPaymentMethod("PIX");
        payment.setAmount(order != null ? order.getTotal() : java.math.BigDecimal.ZERO);
        payment.setStatus("PENDING");
        payment.setPaymentLink(paymentLink);
        payment.setOrderNSU(orderId.toString());
        paymentRepository.save(payment);
    }
}
