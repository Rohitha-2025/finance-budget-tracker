package com.budgetapp.smart_budget_planner.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.budgetapp.smart_budget_planner.model.Income;
import com.budgetapp.smart_budget_planner.service.IncomeService;

@RestController
@RequestMapping("/api/income")
@CrossOrigin(
        origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176","http://127.0.0.1:5176"},
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class IncomeController {

    @Autowired
    private IncomeService incomeService;

    @PostMapping("/add")
    public Map<String, Object> addIncome(@RequestBody Income income) {
        Income savedIncome = incomeService.addIncome(income);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Income added successfully");
        response.put("income", savedIncome);
        return response;
    }

    @GetMapping("/list")
    public Map<String, Object> listIncomes(@RequestParam(required = false) Long userId) {
        List<Income> incomes = userId == null
                ? incomeService.getAllIncomes()
                : incomeService.getIncomes(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("incomes", incomes);
        return response;
    }

    @GetMapping("/get/{userId}")
    public List<Income> getIncomes(@PathVariable Long userId) {
        return incomeService.getIncomes(userId);
    }

    @PutMapping("/update/{id}")
    public Object updateIncome(@PathVariable Long id, @RequestBody Income income) {
        Income updated = incomeService.updateIncome(id, income);

        if (updated == null) {
            return "Income not found!";
        }

        return updated;
    }

    @DeleteMapping("/delete/{id}")
    public String deleteIncome(@PathVariable Long id) {
        boolean exists = incomeService.incomeExists(id);

        if (!exists) {
            return "Income not found!";
        }

        incomeService.deleteIncome(id);
        return "Income deleted successfully";
    }
}
