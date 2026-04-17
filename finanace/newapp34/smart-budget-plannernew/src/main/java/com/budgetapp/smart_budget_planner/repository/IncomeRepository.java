package com.budgetapp.smart_budget_planner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.budgetapp.smart_budget_planner.model.Income;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUserId(Long userId);
}
