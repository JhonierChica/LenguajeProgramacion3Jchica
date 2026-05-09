package com.edu.uniremintong.jchica.lenguajesP3.modules.customer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edu.uniremintong.jchica.lenguajesP3.modules.customer.model.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

}
