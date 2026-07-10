package com.lisory.backend.pagamentos.services;

public record GatewayResponse(
    String gatewayId,
    String transactionId,
    String status,
    String paymentUrl
) {}
