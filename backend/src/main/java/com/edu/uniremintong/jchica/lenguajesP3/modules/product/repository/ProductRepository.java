package com.edu.uniremintong.jchica.lenguajesP3.modules.product.repository;

import com.edu.uniremintong.jchica.lenguajesP3.modules.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByAvailableTrue();
}
