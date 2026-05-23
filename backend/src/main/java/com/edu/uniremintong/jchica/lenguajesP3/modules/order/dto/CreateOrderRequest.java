package com.edu.uniremintong.jchica.lenguajesP3.modules.order.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    private Long customerId;
    private List<OrderItemRequest> items;
    private String notes;
    private String status;
}
