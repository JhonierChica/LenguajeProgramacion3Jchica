package com.edu.uniremintong.jchica.lenguajesP3.modules.order.service;

import com.edu.uniremintong.jchica.lenguajesP3.modules.customer.model.Customer;
import com.edu.uniremintong.jchica.lenguajesP3.modules.customer.repository.CustomerRepository;
import com.edu.uniremintong.jchica.lenguajesP3.modules.order.dto.*;
import com.edu.uniremintong.jchica.lenguajesP3.modules.order.model.Order;
import com.edu.uniremintong.jchica.lenguajesP3.modules.order.model.OrderItem;
import com.edu.uniremintong.jchica.lenguajesP3.modules.order.repository.OrderRepository;
import com.edu.uniremintong.jchica.lenguajesP3.modules.product.model.Product;
import com.edu.uniremintong.jchica.lenguajesP3.modules.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
            CustomerRepository customerRepository,
            ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    public OrderResponse createOrder(CreateOrderRequest request) {
        // 1. Validar Cliente
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + request.getCustomerId()));

        // 2. Validar que hay items
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order must have at least one item");
        }

        // 3. Pre-fetch de productos para evitar N+1
        List<Long> productIds = request.getItems().stream()
                .map(OrderItemRequest::getProductId)
                .collect(Collectors.toList());
        Map<Long, Product> productMap = productRepository.findAllById(productIds).stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        // 4. Validar productos y calcular total
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productMap.get(itemRequest.getProductId());
            if (product == null) {
                throw new RuntimeException("Product not found with id: " + itemRequest.getProductId());
            }
            if (!product.getAvailable()) {
                throw new RuntimeException("Product is not available: " + product.getName());
            }
            // totalAmount += price * quantity
            BigDecimal itemSubtotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemSubtotal);
        }

        // 5. Crear la orden (Cabecera)
        Order order = new Order();
        order.setCustomer(customer);
        order.setTotalAmount(totalAmount);
        order.setNotes(request.getNotes());
        order.setStatus("PENDIENTE");

        // Guardar para obtener ID
        Order savedOrder = orderRepository.save(order);

        // 6. Agregar los items
        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productMap.get(itemRequest.getProductId());

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(product.getPrice());

            savedOrder.addItem(orderItem);


        }

        return mapToResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return mapToResponse(order);
    }

    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        orderRepository.delete(order);
    }

    private OrderResponse mapToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setCustomerId(order.getCustomer().getId());
        response.setCustomerName(order.getCustomer().getFullName());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setNotes(order.getNotes());
        response.setCreatedAt(order.getCreatedAt());

        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> {
                    OrderItemResponse ir = new OrderItemResponse();
                    ir.setProductId(item.getProduct().getId());
                    ir.setProductName(item.getProduct().getName());
                    ir.setQuantity(item.getQuantity());
                    ir.setUnitPrice(item.getUnitPrice());
                    ir.setSubtotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                    return ir;
                }).collect(Collectors.toList());

        response.setItems(itemResponses);
        return response;
    }
}
