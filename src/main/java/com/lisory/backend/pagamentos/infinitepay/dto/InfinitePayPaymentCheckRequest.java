package com.lisory.backend.pagamentos.infinitepay.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record InfinitePayPaymentCheckRequest(
    @JsonProperty("handle") String handle,
    @JsonProperty("order_nsu") String orderNsu,
    @JsonProperty("transaction_nsu") String transactionNsu,
    @JsonProperty("slug") String slug
) {}
