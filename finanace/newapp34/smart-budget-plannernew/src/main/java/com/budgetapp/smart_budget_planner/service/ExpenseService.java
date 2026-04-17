package com.budgetapp.smart_budget_planner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.budgetapp.smart_budget_planner.model.*;
import com.budgetapp.smart_budget_planner.repository.*;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepo;

    @Autowired
    private BudgetRepository budgetRepo;

    // ✅ ADD EXPENSE + BUDGET CHECK
    public String addExpense(Expense expense) {

        // Save expense
        expenseRepo.save(expense);

        // Get all expenses of user
        List<Expense> expenses = expenseRepo.findByUserId(expense.getUserId());

        double total = 0;

        // Calculate total for that category
        for (Expense e : expenses) {
            if (e.getCategory().equals(expense.getCategory())) {
                total += e.getAmount();
            }
        }

        // Get budget
        Budget budget = budgetRepo.findByUserIdAndCategory(
                expense.getUserId(),
                expense.getCategory()
        );

        // Budget check
        if (budget != null && total > budget.getLimitAmount()) {
            return "⚠ Budget exceeded!";
        }

        return "Expense added successfully";
    }

    // ✅ GET EXPENSES BY USER
    public List<Expense> getExpenses(Long userId) {
        return expenseRepo.findByUserId(userId);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepo.findAll();
    }

    // ✅ UPDATE EXPENSE
    public Expense updateExpense(Long id, Expense expense) {

        Expense existing = expenseRepo.findById(id).orElse(null);

        if (existing != null) {
            existing.setCategory(expense.getCategory());
            existing.setAmount(expense.getAmount());
            existing.setDate(expense.getDate());
            existing.setDescription(expense.getDescription());
            return expenseRepo.save(existing);
        }

        return null;
    }

    // ✅ DELETE EXPENSE
    public void deleteExpense(Long id) {
        expenseRepo.deleteById(id);
    }

    // ✅ CHECK IF EXPENSE EXISTS
    public boolean expenseExists(Long id) {
        return expenseRepo.existsById(id);
    }
}
