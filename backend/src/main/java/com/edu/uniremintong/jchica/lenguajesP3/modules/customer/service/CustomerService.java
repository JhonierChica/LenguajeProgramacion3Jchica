package com.edu.uniremintong.jchica.lenguajesP3.modules.customer.service;

import org.springframework.stereotype.Service;

import com.edu.uniremintong.jchica.lenguajesP3.modules.customer.model.Customer;
import com.edu.uniremintong.jchica.lenguajesP3.modules.customer.repository.CustomerRepository;
import java.util.List;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id).orElse(null);
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer customer) {
        Customer existingCustomer = customerRepository.findById(id).orElse(null);
        if (existingCustomer == null) {
            return null;
        }
        existingCustomer.setCedula(customer.getCedula());
        existingCustomer.setFullName(customer.getFullName());
        existingCustomer.setPhone(customer.getPhone());
        existingCustomer.setAddress(customer.getAddress());
        return customerRepository.save(existingCustomer);
    }

    public Customer deleteCustomer(Long id) {
        Customer existingCustomer = customerRepository.findById(id).orElse(null);
        if (existingCustomer == null) {
            return null;
        }
        customerRepository.delete(existingCustomer);
        return existingCustomer;
    }

}
