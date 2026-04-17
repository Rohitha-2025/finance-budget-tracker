import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BudgetCard from './BudgetCard';
import API from "../../services/api";

// Budget - Set and view category-wise budgets
function Budget(props) {
  // props: budgets, transactions, onSetBudget
  const location = useLocation();
  var [category, setCategory] = useState('Food');
  var [limit, setLimit] = useState('');

  var categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Others'];
  var transactions = props.transactions || [];
  var budgets = props.budgets || [];

  useEffect(function () {
    if (location.state?.category) {
      setCategory(location.state.category);
    }

    if (location.state?.suggestedLimit) {
      setLimit(String(Math.ceil(Number(location.state.suggestedLimit))));
    }
  }, [location.state]);

  // Calculate spending per category
  var spending = {};
  transactions.forEach(function (txn) {
    if (txn.type === 'expense') {
      var cat = txn.category || 'Others';
      spending[cat] = (spending[cat] || 0) + txn.amount;
    }
  });

  async function handleSet(e) {
    e.preventDefault();
    if (!limit || Number(limit) <= 0) return;

    try {
      await API.post("/budget/set", {
        category: category,
        limit: Number(limit),
        limitAmount: Number(limit),
        userId: props.user?.id || 1
      });

      props.onSetBudget(category, Number(limit));
      setLimit('');
      alert('Budget set successfully! ✅');
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.error || error?.response?.data?.message || error.message || "Error setting budget";
      alert(message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Budget</h1>
        <p>Set and track your category-wise budgets</p>
      </div>

      <div className="card">
        <h3>Set Budget</h3>
        {location.state?.category && (
          <div className="budget-prefill-note">
            Set a new budget for {location.state.category}. The suggested limit covers your current spending.
          </div>
        )}
        <form onSubmit={handleSet}>
          <div className="budget-form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={function (e) { setCategory(e.target.value); }}>
                {categories.map(function (cat) {
                  return <option key={cat} value={cat}>{cat}</option>;
                })}
              </select>
            </div>
            <div className="form-group">
              <label>Budget Limit (₹)</label>
              <input type="number" placeholder="e.g. 5000" value={limit} onChange={function (e) { setLimit(e.target.value); }} min="1" />
            </div>
            <button type="submit" className="btn-sm">Set</button>
          </div>
        </form>
      </div>

      <div className="budget-grid">
        {budgets.map(function (b) {
          return (
            <BudgetCard
              key={b.category}
              category={b.category}
              limit={b.limit}
              spent={spending[b.category] || 0}
            />
          );
        })}
        {budgets.length === 0 && (
          <div className="card">
            <p style={{ color: '#a0aec0', fontSize: '14px' }}>No budgets set yet. Use the form above to set category budgets.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Budget;
