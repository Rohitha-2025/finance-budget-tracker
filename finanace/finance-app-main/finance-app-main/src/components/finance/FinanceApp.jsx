import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import API from "../../services/api";
import Login from './Login';
import Register from './Register';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import AddExpense from './AddExpense';
import AddIncome from './AddIncome';
import Budget from './Budget';
import Reports from './Reports';
import Profile from './Profile';

// Dummy initial data
var initialTransactions = [];
var initialBudgets = [];
var USER_STORAGE_KEY = 'fintrackUser';

function getSavedUser() {
  try {
    var savedUser = localStorage.getItem(USER_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error('Error loading saved user:', error);
    return null;
  }
}

function saveUser(userData) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
}

function normalizeUser(userData) {
  return {
    ...userData,
    fullName: userData.fullName || userData.name || '',
    accountType: userData.accountType || 'Personal',
  };
}

function FinanceApp() {
  const navigate = useNavigate();
  const savedUser = getSavedUser();
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(savedUser));
  const [transactions, setTransactions] = useState(initialTransactions);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [user, setUser] = useState(savedUser || {
    fullName: 'Rahul Sharma',
    email: 'rahul@example.com',
    username: 'rahul_sharma',
    accountType: 'Personal',
    photo: null,
  });

  function handleLogin(userData) {
    setUser(function (prev) {
      var nextUser = normalizeUser({ ...prev, ...userData });
      saveUser(nextUser);
      return nextUser;
    });
    setIsLoggedIn(true);
    fetchUserData(userData.id);
    navigate('/dashboard');
  }

  useEffect(function () {
    if (savedUser?.id) {
      fetchUserData(savedUser.id);
    }
  }, []);

  async function fetchUserData(userId) {
    try {
      const query = userId ? `?userId=${userId}` : '';
      const [expensesRes, incomeRes, budgetsRes] = await Promise.all([
        API.get(`/expense/list${query}`),
        API.get(`/income/list${query}`),
        API.get(`/budget/list${query}`)
      ]);

      const expenses = (expensesRes.data?.expenses || []).map(function (e) {
        return { ...e, type: 'expense', id: e.id || Date.now() };
      });

      const incomes = (incomeRes.data?.incomes || []).map(function (i) {
        return { ...i, type: 'income', id: i.id || Date.now() };
      });

      const allTransactions = [...expenses, ...incomes];
      setTransactions(allTransactions);

      const budgetData = budgetsRes.data?.budgets || [];
      setBudgets(budgetData.map(function (b) {
        return { ...b, limit: b.limit ?? b.limitAmount };
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  function handleRegister(data) {
    var registeredUser = {
      fullName: data.fullName,
      email: data.email,
      username: data.username,
      accountType: 'Personal',
    };
    setUser(registeredUser);
    saveUser(registeredUser);
    setIsLoggedIn(true);
    navigate('/dashboard');
  }

  function handleLogout() {
    localStorage.removeItem(USER_STORAGE_KEY);
    setIsLoggedIn(false);
    navigate('/login');
  }

  async function handleUpdateProfile(updatedUser) {
    var nextUser = normalizeUser({ ...user, ...updatedUser });

    if (nextUser.id || nextUser.email) {
      try {
        const res = await API.put("/auth/profile", {
          id: nextUser.id,
          name: nextUser.fullName,
          email: nextUser.email,
          username: nextUser.username,
        });

        nextUser = normalizeUser({
          ...nextUser,
          ...res.data,
          fullName: res.data?.name || nextUser.fullName,
        });
      } catch (error) {
        console.error("Error updating profile in database:", error);
        if (error?.response?.status === 404) {
          alert("Profile saved in this browser, but the running backend is old. Restart Spring Boot from the updated backend folder so /api/auth/profile is available.");
        } else {
          alert(error?.response?.data?.message || error?.response?.data || "Profile saved in this browser, but database update failed. Check that Spring Boot and MySQL are running.");
        }
      }
    }

    setUser(function (prev) {
      var mergedUser = normalizeUser({ ...prev, ...nextUser });
      saveUser(mergedUser);
      return mergedUser;
    });
  }

  function handleAddExpense(expense) {
    setTransactions(function (prev) { return [...prev, expense]; });
  }

  function handleAddIncome(income) {
    setTransactions(function (prev) { return [...prev, income]; });
  }

  function handleSetBudget(category, limit) {
    setBudgets(function (prev) {
      var exists = prev.find(function (b) { return b.category === category; });
      if (exists) {
        return prev.map(function (b) {
          return b.category === category ? { ...b, limit: limit } : b;
        });
      }
      return [...prev, { category: category, limit: limit }];
    });
  }

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route
          path="/register"
          element={<Register onRegister={handleRegister} onGoToLogin={function () { navigate('/login'); }} />}
        />
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} onGoToRegister={function () { navigate('/register'); }} />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-layout">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard user={user} transactions={transactions} budgets={budgets} />} />
          <Route path="/add-expense" element={<AddExpense onAddExpense={handleAddExpense} budgets={budgets} transactions={transactions} user={user} />} />
          <Route path="/add-income" element={<AddIncome onAddIncome={handleAddIncome} user={user} />} />
          <Route path="/budget" element={<Budget budgets={budgets} transactions={transactions} onSetBudget={handleSetBudget} user={user} />} />
          <Route path="/reports" element={<Reports transactions={transactions} />} />
          <Route path="/profile" element={<Profile user={user} onUpdateProfile={handleUpdateProfile} />} />
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/register" element={<Navigate to="/dashboard" replace />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default FinanceApp;
