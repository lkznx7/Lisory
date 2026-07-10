package com.lisory.backend.pagamentos.infinitepay.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record InfinitePayPaymentCheckResponse(
    @JsonProperty("success") boolean success,
    @JsonProperty("paid") boolean paid,
    @JsonProperty("amount") long amount,
    @JsonProperty("paid_amount") long paidAmount,
    @JsonProperty("installments") int installments,
    @JsonProperty("capture_method") String captureMethod,
    @JsonProperty("error") String error,
    @JsonProperty("message") String message
) {}
