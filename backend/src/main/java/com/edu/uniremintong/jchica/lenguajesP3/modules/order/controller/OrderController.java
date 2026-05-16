package com.edu.uniremintong.jchica.lenguajesP3.modules.order.controller;

import com.edu.uniremintong.jchica.lenguajesP3.modules.order.dto.CreateOrderRequest;
import com.edu.uniremintong.jchica.lenguajesP3.modules.order.dto.OrderResponse;
import com.edu.uniremintong.jchica.lenguajesP3.modules.order.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponse createOrder(@RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public OrderResponse getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }
}
