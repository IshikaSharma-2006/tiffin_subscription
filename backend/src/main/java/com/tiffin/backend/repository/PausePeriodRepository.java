package com.tiffin.backend.repository;

import com.tiffin.backend.entity.PausePeriod;
import com.tiffin.backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PausePeriodRepository extends JpaRepository<PausePeriod, Long> {

    List<PausePeriod> findByCustomer(Customer customer);
}