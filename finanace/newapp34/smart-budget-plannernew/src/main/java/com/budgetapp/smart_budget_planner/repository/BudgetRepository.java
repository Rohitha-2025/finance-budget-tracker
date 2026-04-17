package com.budgetapp.smart_budget_planner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.budgetapp.smart_budget_planner.model.Budget;
import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    // Find budget by user and category
    Budget findByUserIdAndCategory(Long userId, String category);

    List<Budget> findByUserId(Long userId);
}
