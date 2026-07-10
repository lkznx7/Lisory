package com.lisory.backend.pagamentos.infinitepay.webhook;

import com.lisory.backend.envios.services.ShipmentService;
import com.lisory.backend.pagamentos.entity.Payment;
import com.lisory.backend.pagamentos.infinitepay.dto.InfinitePayWebhookEvent;
import com.lisory.backend.pagamentos.repository.PaymentRepository;
import com.lisory.backend.pedido.entity.Order;
import com.lisory.backend.pedido.entity.OrderStatus;
import com.lisory.backend.pedido.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("InfinitePayWebhookService Tests")
class InfinitePayWebhookServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ShipmentService shipmentService;

    @InjectMocks
    private InfinitePayWebhookService webhookService;

    private UUID orderId;

    @BeforeEach
    void setUp() {
        orderId = UUID.randomUUID();
    }

    @Test
    @DisplayName("should process payment webhook and approve payment")
    void shouldProcessPaymentWebhook() {
        Payment payment = new Payment();
        payment.setId(UUID.randomUUID());
        Order order = new Order();
        order.setId(orderId);
        payment.setOrder(order);
        payment.setStatus("PENDING");

        Order orderEntity = new Order();
        orderEntity.setId(orderId);
        orderEntity.setStatus(OrderStatus.AGUARDANDO_PAGAMENTO.name());

        when(paymentRepository.findByOrderId(orderId)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(orderEntity));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        InfinitePayWebhookEvent event = new InfinitePayWebhookEvent(
                "abc123",
                1500L,
                1510L,
                1,
                "pix",
                "txn-uuid-123",
                orderId.toString(),
                "https://comprovante.com/123"
        );

        webhookService.processEvent(event);

        verify(paymentRepository, times(1)).save(any(Payment.class));
        assertEquals("APPROVED", payment.getStatus());
        assertNotNull(payment.getPaidAt());
        assertEquals("txn-uuid-123", payment.getTransactionNSU());
        assertEquals("abc123", payment.getOrderNSU());
        assertEquals("pix", payment.getPaymentMethod());
        assertEquals(OrderStatus.PAGO.name(), orderEntity.getStatus());
    }

    @Test
    @DisplayName("should skip idempotent events")
    void shouldSkipIdempotentEvents() {
        Payment payment = new Payment();
        payment.setId(UUID.randomUUID());
        Order order = new Order();
        order.setId(orderId);
        payment.setOrder(order);
        payment.setStatus("APPROVED");

        when(paymentRepository.findByOrderId(orderId)).thenReturn(Optional.of(payment));

        InfinitePayWebhookEvent event = new InfinitePayWebhookEvent(
                "abc123", 1500L, 1510L, 1, "pix", "txn-123", orderId.toString(), null
        );

        webhookService.processEvent(event);

        verify(paymentRepository, never()).save(any());
    }

    @Test
    @DisplayName("should handle missing order_nsu")
    void shouldHandleMissingOrderNsu() {
        InfinitePayWebhookEvent event = new InfinitePayWebhookEvent(
                "abc123", 1500L, 1510L, 1, "pix", "txn-123", null, null
        );

        webhookService.processEvent(event);

        verify(paymentRepository, never()).findByOrderId(any());
    }

    @Test
    @DisplayName("should handle payment not found")
    void shouldHandlePaymentNotFound() {
        when(paymentRepository.findByOrderId(orderId)).thenReturn(Optional.empty());

        InfinitePayWebhookEvent event = new InfinitePayWebhookEvent(
                "abc123", 1500L, 1510L, 1, "pix", "txn-123", orderId.toString(), null
        );

        webhookService.processEvent(event);

        verify(paymentRepository, never()).save(any());
    }
}
