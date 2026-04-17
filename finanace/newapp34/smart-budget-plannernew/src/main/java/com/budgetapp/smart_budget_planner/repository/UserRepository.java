package com.budgetapp.smart_budget_planner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.budgetapp.smart_budget_planner.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email); // ✅ used in login
}