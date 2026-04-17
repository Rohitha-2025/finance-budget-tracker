package com.budgetapp.smart_budget_planner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.budgetapp.smart_budget_planner.model.Budget;
import com.budgetapp.smart_budget_planner.repository.BudgetRepository;
import java.util.List;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepo;

    // ✅ SET BUDGET
    public Budget setBudget(Budget budget) {
        return budgetRepo.save(budget);
    }

    // ✅ GET BUDGET
    public Budget getBudget(Long userId, String category) {
        return budgetRepo.findByUserIdAndCategory(userId, category);
    }

    public List<Budget> getBudgets(Long userId) {
        return budgetRepo.findByUserId(userId);
    }

    public List<Budget> getAllBudgets() {
        return budgetRepo.findAll();
    }

    // ✅ UPDATE BUDGET
    public Budget updateBudget(Long id, Budget budget) {

        Budget existing = budgetRepo.findById(id).orElse(null);

        if (existing != null) {
            existing.setCategory(budget.getCategory());
            existing.setLimitAmount(budget.getLimitAmount());
            return budgetRepo.save(existing);
        }

        return null;
    }

    // ✅ DELETE BUDGET
    public void deleteBudget(Long id) {
        budgetRepo.deleteById(id);
    }

    // ✅ CHECK IF EXISTS
    public boolean budgetExists(Long id) {
        return budgetRepo.existsById(id);
    }
}
