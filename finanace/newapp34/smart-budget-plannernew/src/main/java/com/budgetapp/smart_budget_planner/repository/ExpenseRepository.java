package com.budgetapp.smart_budget_planner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.budgetapp.smart_budget_planner.model.Expense;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Get all expenses of a user
    List<Expense> findByUserId(Long userId);
}