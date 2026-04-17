package com.budgetapp.smart_budget_planner.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.budgetapp.smart_budget_planner.model.Expense;
import com.budgetapp.smart_budget_planner.service.ExpenseService;

@RestController
@RequestMapping("/api/expense")
@CrossOrigin(
	    origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176","http://127.0.0.1:5176"},
	    allowedHeaders = "*",
	    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
	)
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    // ✅ ADD EXPENSE
    @PostMapping("/add")
    public Map<String, Object> addExpense(@RequestBody Expense expense) {
        String message = expenseService.addExpense(expense);

        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("expense", expense);
        return response;
    }

    @GetMapping("/list")
    public Map<String, Object> listExpenses(@RequestParam(required = false) Long userId) {
        List<Expense> expenses = userId == null
                ? expenseService.getAllExpenses()
                : expenseService.getExpenses(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("expenses", expenses);
        return response;
    }

    // ✅ GET EXPENSES BY USER
    @GetMapping("/get/{userId}")
    public List<Expense> getExpenses(@PathVariable Long userId) {
        return expenseService.getExpenses(userId);
    }

    // ✅ UPDATE EXPENSE
    @PutMapping("/update/{id}")
    public Object updateExpense(@PathVariable Long id, @RequestBody Expense expense) {

        Expense updated = expenseService.updateExpense(id, expense);

        if (updated == null) {
            return "Expense not found!";
        }

        return updated;
    }

    // ✅ DELETE EXPENSE
    @DeleteMapping("/delete/{id}")
    public String deleteExpense(@PathVariable Long id) {

        boolean exists = expenseService.expenseExists(id);

        if (!exists) {
            return "Expense not found!";
        }

        expenseService.deleteExpense(id);
        return "Expense deleted successfully";
    }
}
