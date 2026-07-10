package com.lisory.backend.carrinho.dto;

import jakarta.validation.constraints.Min;

public record CartUpdateRequest(
        @Min(0) Integer quantity
) {}
