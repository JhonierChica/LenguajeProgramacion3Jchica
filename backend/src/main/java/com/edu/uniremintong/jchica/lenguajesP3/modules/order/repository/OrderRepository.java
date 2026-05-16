package com.edu.uniremintong.jchica.lenguajesP3.modules.order.repository;

import com.edu.uniremintong.jchica.lenguajesP3.modules.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerId(Long customerId);
    List<Order> findByStatus(String status);
}
