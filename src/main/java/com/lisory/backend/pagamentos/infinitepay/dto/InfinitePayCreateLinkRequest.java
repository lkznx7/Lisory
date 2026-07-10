package com.lisory.backend.pagamentos.infinitepay.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record InfinitePayCreateLinkRequest(
    @JsonProperty("handle") String handle,
    @JsonProperty("redirect_url") String redirectUrl,
    @JsonProperty("webhook_url") String webhookUrl,
    @JsonProperty("order_nsu") String orderNsu,
    @JsonProperty("items") List<LinkItem> items,
    @JsonProperty("customer") CustomerInfo customer,
    @JsonProperty("address") AddressInfo address
) {
    public record LinkItem(
        @JsonProperty("quantity") int quantity,
        @JsonProperty("price") long price,
        @JsonProperty("description") String description
    ) {}

    public record CustomerInfo(
        @JsonProperty("name") String name,
        @JsonProperty("email") String email,
        @JsonProperty("phone_number") String phoneNumber
    ) {}

    public record AddressInfo(
        @JsonProperty("cep") String cep,
        @JsonProperty("number") String number,
        @JsonProperty("complement") String complement
    ) {}
}
