package com.budgetapp.smart_budget_planner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.budgetapp.smart_budget_planner.model.User;
import com.budgetapp.smart_budget_planner.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    
    // ✅ ADD THIS (for login)
    public User findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public User updateProfile(User user) {
        User existingUser = null;

        if (user.getId() != null) {
            existingUser = userRepo.findById(user.getId()).orElse(null);
        }

        if (existingUser == null && user.getEmail() != null) {
            existingUser = userRepo.findByEmail(user.getEmail());
        }

        if (existingUser == null) {
            return null;
        }

        if (user.getName() != null && !user.getName().isEmpty()) {
            existingUser.setName(user.getName());
        }

        if (user.getUsername() != null && !user.getUsername().isEmpty()) {
            existingUser.setUsername(user.getUsername());
        }

        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            existingUser.setEmail(user.getEmail());
        }

        return userRepo.save(existingUser);
    }

    public User register(User user) {

        User existing = userRepo.findByEmail(user.getEmail());

        if (existing != null) {
            throw new RuntimeException("User already exists!");
        }

        return userRepo.save(user);
    }
}
