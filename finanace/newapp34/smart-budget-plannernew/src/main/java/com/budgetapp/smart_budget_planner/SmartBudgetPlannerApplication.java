package com.budgetapp.smart_budget_planner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartBudgetPlannerApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartBudgetPlannerApplication.class, args);
		System.out.println("Backend Is running on PORT: 8080, Open URL: http://localhost:8080\n"
				+ "");
	}
	}

