package com.lisory.backend.cupons.controller;

import com.lisory.backend.cupons.dto.CouponResponse;
import com.lisory.backend.cupons.services.CouponService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/coupons")
public class PublicCouponController {

    private final CouponService couponService;

    public PublicCouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping("/validate")
    public ResponseEntity<CouponResponse> validate(@RequestBody ValidateCouponRequest request) {
        couponService.validateAndApply(request.code(), request.orderValue(), null);
        return ResponseEntity.ok(couponService.findByCode(request.code()));
    }

    record ValidateCouponRequest(String code, BigDecimal orderValue) {}
}
