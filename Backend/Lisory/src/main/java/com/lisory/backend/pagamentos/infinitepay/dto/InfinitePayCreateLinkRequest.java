package com.lisory.backend.pagamentos.infinitepay.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record InfinitePayCreateLinkRequest(
    @JsonProperty("handle") String handle,
    @JsonProperty("redirect_url") String redirectUrl,
    @JsonProperty("webhook_url") String webhookUrl,
    @JsonProperty("order_nsu") String orderNsu,
    @JsonProperty("itens") List<LinkItem> items,
    @JsonProperty("customer") CustomerData customer,
    @JsonProperty("address") AddressData address
) {
    public record LinkItem(
        @JsonProperty("quantity") int quantity,
        @JsonProperty("price") long price,
        @JsonProperty("description") String description
    ) {}

    public record CustomerData(
        @JsonProperty("name") String name,
        @JsonProperty("email") String email,
        @JsonProperty("phone_number") String phoneNumber
    ) {}

    public record AddressData(
        @JsonProperty("cep") String cep,
        @JsonProperty("street") String street,
        @JsonProperty("neighborhood") String neighborhood,
        @JsonProperty("number") String number,
        @JsonProperty("complement") String complement
    ) {}
}
