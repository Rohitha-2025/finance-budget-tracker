package com.budgetapp.smart_budget_planner.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.budgetapp.smart_budget_planner.model.Budget;
import com.budgetapp.smart_budget_planner.service.BudgetService;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin(
	    origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176","http://127.0.0.1:5176"},
	    allowedHeaders = "*",
	    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
	)
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    // ✅ SET BUDGET
    @PostMapping("/set")
    public Budget setBudget(@RequestBody Budget budget) {
        return budgetService.setBudget(budget);
    }

    @GetMapping("/list")
    public Map<String, Object> listBudgets(@RequestParam(required = false) Long userId) {
        List<Budget> budgets = userId == null
                ? budgetService.getAllBudgets()
                : budgetService.getBudgets(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("budgets", budgets);
        return response;
    }

    // ✅ GET BUDGET BY USER + CATEGORY
    @GetMapping("/{userId}/{category}")
    public Object getBudget(@PathVariable Long userId, @PathVariable String category) {

        Budget budget = budgetService.getBudget(userId, category);

        if (budget == null) {
            return "Budget not found!";
        }

        return budget;
    }

    // ✅ UPDATE BUDGET
    @PutMapping("/update/{id}")
    public Object updateBudget(@PathVariable Long id, @RequestBody Budget budget) {

        Budget updated = budgetService.updateBudget(id, budget);

        if (updated == null) {
            return "Budget not found!";
        }

        return updated;
    }

    // ✅ DELETE BUDGET
    @DeleteMapping("/delete/{id}")
    public String deleteBudget(@PathVariable Long id) {

        boolean exists = budgetService.budgetExists(id);

        if (!exists) {
            return "Budget not found!";
        }

        budgetService.deleteBudget(id);
        return "Budget deleted successfully";
    }
}
