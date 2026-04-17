package com.budgetapp.smart_budget_planner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.budgetapp.smart_budget_planner.model.Income;
import com.budgetapp.smart_budget_planner.repository.IncomeRepository;

import java.util.List;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepository incomeRepo;

    public Income addIncome(Income income) {
        return incomeRepo.save(income);
    }

    public List<Income> getIncomes(Long userId) {
        return incomeRepo.findByUserId(userId);
    }

    public List<Income> getAllIncomes() {
        return incomeRepo.findAll();
    }

    public Income updateIncome(Long id, Income income) {
        Income existing = incomeRepo.findById(id).orElse(null);

        if (existing != null) {
            existing.setSource(income.getSource());
            existing.setAmount(income.getAmount());
            existing.setDate(income.getDate());
            existing.setDescription(income.getDescription());
            return incomeRepo.save(existing);
        }

        return null;
    }

    public void deleteIncome(Long id) {
        incomeRepo.deleteById(id);
    }

    public boolean incomeExists(Long id) {
        return incomeRepo.existsById(id);
    }
}
