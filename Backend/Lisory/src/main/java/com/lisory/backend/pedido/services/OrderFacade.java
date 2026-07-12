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
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class OrderFacade {

    private static final Logger log = LoggerFactory.getLogger(OrderFacade.class);

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final CouponService couponService;
    private final PaymentService paymentService;
    private final ShipmentService shipmentService;
    private final OrderResponseMapper responseMapper;

    @PersistenceContext
    private EntityManager entityManager;

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

    @Transactional
    public OrderResponse checkout(UUID userId, UUID guestCartId, OrderRequest request) {
        Cart cart = findCart(userId, guestCartId);

        if (cart.getItems().isEmpty()) {
            throw new BusinessException("Cart is empty");
        }

        Address address = resolveAddress(request.addressId());
        BigDecimal subtotal = calculateSubtotal(cart);

        BigDecimal discount = BigDecimal.ZERO;
        Coupon coupon = null;
        if (request.couponCode() != null && !request.couponCode().isBlank()) {
            coupon = couponService.validateAndApply(request.couponCode(), subtotal, request.guestEmail());
            discount = calculateDiscount(coupon, subtotal);
        }

        BigDecimal shippingCost = request.shippingCost() != null ? request.shippingCost() : BigDecimal.ZERO;

        Order order = createOrder(userId, address, coupon, subtotal, discount, request);
        order.setStatus(OrderStatus.AGUARDANDO_PAGAMENTO.name());
        order.setShippingCost(shippingCost);
        order.setTotal(subtotal.subtract(discount).add(shippingCost));
        Order savedOrder = orderRepository.save(order);

        Set<OrderItem> items = createOrderItems(savedOrder, cart);
        savedOrder.setItems(items);
        orderRepository.save(savedOrder);

        cartItemRepository.deleteByCartId(cart.getId());

        try {
            paymentService.initiatePayment(savedOrder.getId(), request.paymentMethod(), savedOrder.getTotal());
        } catch (Exception e) {
            log.error("payment_initiation_failed_for_order_{}", savedOrder.getId(), e);
        }

        return responseMapper.toResponse(savedOrder);
    }

    public OrderResponse confirmPayment(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.setStatus(OrderStatus.PAGO.name());
        Order savedOrder = orderRepository.save(order);

        ShippingQuote defaultQuote = new ShippingQuote("PAC", "PAC", BigDecimal.ZERO, 0);
        shipmentService.createShipment(orderId, defaultQuote);

        return responseMapper.toResponse(savedOrder);
    }

    private Cart findCart(UUID userId, UUID guestCartId) {
        if (userId != null) {
            return cartRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cart", "userId", userId));
        } else if (guestCartId != null) {
            return cartRepository.findByGuestCartIdWithItems(guestCartId)
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
            order.setUser(entityManager.getReference(AuthEntity.class, userId));
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

    private Set<OrderItem> createOrderItems(Order order, Cart cart) {
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
                .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal subtotal) {
        if (coupon == null) return BigDecimal.ZERO;
        if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
            return subtotal.multiply(coupon.getDiscountValue()).divide(new BigDecimal("100"));
        } else if ("FIXED".equalsIgnoreCase(coupon.getDiscountType())) {
            BigDecimal discount = coupon.getDiscountValue();
            return discount.compareTo(subtotal) > 0 ? subtotal : discount;
        }
        return BigDecimal.ZERO;
    }
}
