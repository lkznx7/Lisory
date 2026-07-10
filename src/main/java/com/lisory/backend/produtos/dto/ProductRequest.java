package com.lisory.backend.produtos.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductRequest(
        @NotBlank String name,
        String description,
        String sku,
        @NotNull @DecimalMin("0.01") BigDecimal price,
        @DecimalMin("0") BigDecimal promotionalPrice,
        @Min(0) Integer stockQuantity,
        UUID categoryId,
        UUID collectionId,
        Boolean active,
        Boolean featured,
        @DecimalMin("0") BigDecimal weight,
        @DecimalMin("0") BigDecimal height,
        @DecimalMin("0") BigDecimal width,
        @DecimalMin("0") BigDecimal length
) {}
