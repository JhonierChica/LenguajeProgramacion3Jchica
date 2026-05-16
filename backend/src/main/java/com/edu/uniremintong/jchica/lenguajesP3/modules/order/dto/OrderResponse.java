package com.edu.uniremintong.jchica.lenguajesP3.modules.order.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private BigDecimal totalAmount;
    private String status;
    private String notes;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;
}
