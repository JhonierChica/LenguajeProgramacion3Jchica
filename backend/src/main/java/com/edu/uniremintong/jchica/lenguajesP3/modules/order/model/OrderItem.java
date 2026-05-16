package com.edu.uniremintong.jchica.lenguajesP3.modules.order.model;

import com.edu.uniremintong.jchica.lenguajesP3.modules.product.model.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "table_order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(OrderItemId.class)
public class OrderItem {
    @Id
    @ManyToOne
    @JoinColumn(name = "id_order", nullable = false)
    private Order order;

    @Id
    @ManyToOne
    @JoinColumn(name = "id_product", nullable = false)
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;
}
