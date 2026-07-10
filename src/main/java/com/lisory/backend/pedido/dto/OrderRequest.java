package com.lisory.backend.pedido.dto;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderRequest(
        UUID addressId,
        String couponCode,
        @NotBlank String paymentMethod,
        String guestName,
        String guestEmail,
        String guestPhone,
        String guestCpf,
        String street,
        String number,
        String complement,
        String neighborhood,
        String city,
        String state,
        String zipCode,
        String shippingCarrier,
        String shippingService,
        BigDecimal shippingCost
) {}
