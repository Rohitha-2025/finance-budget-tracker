package com.budgetapp.smart_budget_planner.controller;
import org.springframework.http.ResponseEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.budgetapp.smart_budget_planner.model.User;
import com.budgetapp.smart_budget_planner.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
	    origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176","http://127.0.0.1:5176"},
	    allowedHeaders = "*",
	    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
	)
public class AuthController {

    @Autowired
    private UserService userService;

    // ✅ REGISTER
    @PostMapping("/register")
    public Object register(@RequestBody User user) {

        // ✅ FIX: use getName()
        if (user.getName() == null || user.getName().isEmpty()) {
            return "Full name is required!";
        }

        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            return "Username is required!";
        }

        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            return "Email is required!";
        }

        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return "Password is required!";
        }

        if (user.getConfirmPassword() == null || user.getConfirmPassword().isEmpty()) {
            return "Confirm Password is required!";
        }

        if (!user.getPassword().equals(user.getConfirmPassword())) {
            return "Passwords do not match!";
        }

        return userService.register(user);
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        // Validate email
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required!");
        }

        // Validate password
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required!");
        }

        // Check user exists
        User existingUser = userService.findByEmail(user.getEmail());

        if (existingUser == null) {
            return ResponseEntity.status(404).body("User not found!");
        }

        // Check password
        if (!existingUser.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(403).body("Invalid password!");
        }

        // Success
        return ResponseEntity.ok(existingUser);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User user) {

        if (user.getId() == null && (user.getEmail() == null || user.getEmail().isEmpty())) {
            return ResponseEntity.badRequest().body("User id or email is required!");
        }

        User updatedUser = userService.updateProfile(user);

        if (updatedUser == null) {
            return ResponseEntity.status(404).body("User not found!");
        }

        return ResponseEntity.ok(updatedUser);
    }
}
