package com.lisory.backend.pedido.repository;

import com.lisory.backend.pedido.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    Optional<Order> findByIdAndUserId(UUID id, UUID userId);
    Page<Order> findByUserId(UUID userId, Pageable pageable);
    Page<Order> findByStatus(String status, Pageable pageable);
}
