package com.lisory.backend.pedido.services;

import com.lisory.backend.auth.entity.AuthEntity;
import com.lisory.backend.carrinho.entity.Cart;
import com.lisory.backend.carrinho.entity.CartItem;
import com.lisory.backend.carrinho.repository.CartItemRepository;
import com.lisory.backend.carrinho.repository.CartRepository;
import com.lisory.backend.cupons.services.CouponService;
import com.lisory.backend.envios.services.ShipmentService;
import com.lisory.backend.envios.services.ShippingQuote;
import com.lisory.backend.exception.BusinessException;
import com.lisory.backend.exception.ResourceNotFoundException;
import com.lisory.backend.cupons.entity.Coupon;
import com.lisory.backend.pagamentos.services.PaymentService;
import com.lisory.backend.pedido.dto.OrderRequest;
import com.lisory.backend.pedido.dto.OrderResponse;
import com.lisory.backend.pedido.entity.Order;
import com.lisory.backend.pedido.entity.OrderItem;
import com.lisory.backend.pedido.entity.OrderStatus;
import com.lisory.backend.pedido.repository.OrderRepository;
import com.lisory.backend.produtos.entity.Product;
import com.lisory.backend.user.entity.Address;
import com.lisory.backend.user.repository.AddressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Orchestrates the checkout flow:
 * 1. Validate cart
 * 2. Calculate subtotal
 * 3. Apply coupon (optional)
 * 4. Create order with AGUARDANDO_PAGAMENTO status
 * 5. Set shipping cost from selected option
 * 6. Create payment (NOT process it - wait for webhook)
 * 7. Return order with payment link
 *
 * IMPORTANT: Shipment is NOT created at this point.
 * It will be created when payment is confirmed via webhook.
 */
@Service
@Transactional
public class OrderFacade {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final CouponService couponService;
    private final PaymentService paymentService;
    private final ShipmentService shipmentService;
    private final OrderResponseMapper responseMapper;

    public OrderFacade(
            OrderRepository orderRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            AddressRepository addressRepository,
            CouponService couponService,
            PaymentService paymentService,
            ShipmentService shipmentService,
            OrderResponseMapper responseMapper) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.addressRepository = addressRepository;
        this.couponService = couponService;
        this.paymentService = paymentService;
        this.shipmentService = shipmentService;
        this.responseMapper = responseMapper;
    }

    public OrderResponse checkout(UUID userId, UUID guestCartId, OrderRequest request) {
        // 1. Find cart
        Cart cart = findCart(userId, guestCartId);

        // 2. Validate cart is not empty
        if (cart.getItems().isEmpty()) {
            throw new BusinessException("Cart is empty");
        }

        // 3. Resolve address
        Address address = resolveAddress(request.addressId());

        // 4. Calculate subtotal
        BigDecimal subtotal = calculateSubtotal(cart);

        // 5. Apply coupon
        BigDecimal discount = BigDecimal.ZERO;
        Coupon coupon = null;
        if (request.couponCode() != null && !request.couponCode().isBlank()) {
            coupon = couponService.validateAndApply(request.couponCode(), subtotal, request.guestEmail());
            discount = calculateDiscount(coupon, subtotal);
        }

        // 6. Set shipping cost from selected option
        BigDecimal shippingCost = request.shippingCost() != null ? request.shippingCost() : BigDecimal.ZERO;

        // 7. Create order
        Order order = createOrder(userId, address, coupon, subtotal, discount, request);
        order.setStatus(OrderStatus.AGUARDANDO_PAGAMENTO.name());
        order.setShippingCost(shippingCost);
        order.setTotal(subtotal.subtract(discount).add(shippingCost));
        Order savedOrder = orderRepository.save(order);

        // 8. Create order items
        List<OrderItem> items = createOrderItems(savedOrder, cart);
        savedOrder.setItems(items);
        orderRepository.save(savedOrder);

        // 9. Initiate payment (creates payment record, returns payment link)
        paymentService.initiatePayment(savedOrder.getId(), request.paymentMethod(), savedOrder.getTotal());

        // 10. Clear cart
        cartItemRepository.deleteByCartId(cart.getId());

        // 11. Return order response
        return responseMapper.toResponse(savedOrder);
    }

    public OrderResponse confirmPayment(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.setStatus(OrderStatus.PAGO.name());
        Order savedOrder = orderRepository.save(order);

        // Create shipment after payment confirmed
        // Shipping details will be set by the shipping service when label is bought
        ShippingQuote defaultQuote = new ShippingQuote("PAC", "PAC", BigDecimal.ZERO, 0);
        shipmentService.createShipment(orderId, defaultQuote);

        return responseMapper.toResponse(savedOrder);
    }

    private Cart findCart(UUID userId, UUID guestCartId) {
        if (userId != null) {
            return cartRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cart", "userId", userId));
        } else if (guestCartId != null) {
            return cartRepository.findByGuestCartId(guestCartId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cart", "guestCartId", guestCartId));
        }
        throw new BusinessException("Cart identifier is required");
    }

    private Address resolveAddress(UUID addressId) {
        if (addressId == null) return null;
        return addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));
    }

    private BigDecimal calculateSubtotal(Cart cart) {
        return cart.getItems().stream()
                .map(item -> {
                    Product product = item.getProduct();
                    BigDecimal price = product.getPromotionalPrice() != null
                            ? product.getPromotionalPrice() : product.getPrice();
                    return price.multiply(BigDecimal.valueOf(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Order createOrder(UUID userId, Address address, Coupon coupon,
                              BigDecimal subtotal, BigDecimal discount, OrderRequest request) {
        Order order = new Order();
        if (userId != null) {
            AuthEntity user = new AuthEntity();
            user.setId(userId);
            order.setUser(user);
        }
        order.setAddress(address);
        order.setCoupon(coupon);
        order.setSubtotal(subtotal);
        order.setDiscount(discount);
        order.setGuestName(request.guestName());
        order.setGuestEmail(request.guestEmail());
        order.setGuestPhone(request.guestPhone());
        order.setGuestCpf(request.guestCpf());
        return order;
    }

    private List<OrderItem> createOrderItems(Order order, Cart cart) {
        return cart.getItems().stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setProduct(cartItem.getProduct());
                    orderItem.setQuantity(cartItem.getQuantity());
                    Product p = cartItem.getProduct();
                    BigDecimal price = p.getPromotionalPrice() != null
                            ? p.getPromotionalPrice() : p.getPrice();
                    orderItem.setUnitPrice(price);
                    return orderItem;
                })
                .toList();
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal subtotal) {
        if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
            return subtotal.multiply(coupon.getDiscountValue()).divide(new BigDecimal("100"));
        } else if ("FIXED".equalsIgnoreCase(coupon.getDiscountType())) {
            BigDecimal discount = coupon.getDiscountValue();
            return discount.compareTo(subtotal) > 0 ? subtotal : discount;
        }
        return BigDecimal.ZERO;
    }
}
