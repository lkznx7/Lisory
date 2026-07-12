package com.lisory.backend.carrinho.repository;

import com.lisory.backend.carrinho.entity.Cart;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CartRepository extends JpaRepository<Cart, UUID> {
    Optional<Cart> findByUserId(UUID userId);

    @EntityGraph(attributePaths = {"items", "items.product", "items.product.images"})
    Optional<Cart> findByGuestCartIdWithItems(UUID guestCartId);

    Optional<Cart> findByGuestCartId(UUID guestCartId);
}
