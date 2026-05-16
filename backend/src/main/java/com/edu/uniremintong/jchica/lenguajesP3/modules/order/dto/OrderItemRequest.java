package com.edu.uniremintong.jchica.lenguajesP3.modules.order.dto;

import lombok.Data;

@Data
public class OrderItemRequest {
    private Long productId;
    private Integer quantity;
}
