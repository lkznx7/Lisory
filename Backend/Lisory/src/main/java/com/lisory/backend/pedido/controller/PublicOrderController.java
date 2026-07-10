package com.lisory.backend.pedido.controller;

import com.lisory.backend.pedido.dto.OrderRequest;
import com.lisory.backend.pedido.dto.OrderResponse;
import com.lisory.backend.pedido.services.OrderFacade;
import com.lisory.backend.pedido.services.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/orders/public")
public class PublicOrderController {

    private final OrderService orderService;
    private final OrderFacade orderFacade;

    public PublicOrderController(OrderService orderService, OrderFacade orderFacade) {
        this.orderService = orderService;
        this.orderFacade = orderFacade;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createGuestOrder(
            @Valid @RequestBody OrderRequest request,
            @RequestHeader(value = "X-Guest-Cart-Id", required = false) UUID guestCartId) {
        return ResponseEntity.ok(orderFacade.checkout(null, guestCartId, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(orderService.findById(id));
    }
}
