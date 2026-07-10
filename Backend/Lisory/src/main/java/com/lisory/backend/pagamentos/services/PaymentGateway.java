package com.lisory.backend.pagamentos.services;

import java.math.BigDecimal;
import java.util.UUID;

public interface PaymentGateway {
    GatewayResponse processPayment(UUID orderId, BigDecimal amount, String paymentMethod);
}
