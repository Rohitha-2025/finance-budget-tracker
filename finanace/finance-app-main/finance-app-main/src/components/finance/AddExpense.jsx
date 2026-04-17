import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../../services/api";

function AddExpense(props) {
  const navigate = useNavigate();
  var [amount, setAmount] = useState('');
  var [category, setCategory] = useState('Food');
  var [date, setDate] = useState('');
  var [description, setDescription] = useState('');
  var [success, setSuccess] = useState(false);
  var [budgetWarning, setBudgetWarning] = useState(null);

  var categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Others'];
  var budgets = props.budgets || [];
  var transactions = props.transactions || [];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount || !date) return;

    const expenseAmount = Number(amount);

    const budget = budgets.find(function (b) { return b.category === category; });
    if (budget) {
      const categorySpent = transactions
        .filter(function (txn) { return txn.type === 'expense' && txn.category === category; })
        .reduce(function (sum, txn) { return sum + Number(txn.amount); }, 0);

      const budgetLimit = Number(budget.limit ?? budget.limitAmount ?? 0);
      const totalAfterExpense = categorySpent + expenseAmount;

      if (budgetLimit > 0 && totalAfterExpense > budgetLimit) {
        setBudgetWarning({
          category: category,
          budgetLimit: budgetLimit,
          categorySpent: categorySpent,
          expenseAmount: expenseAmount,
          totalAfterExpense: totalAfterExpense,
        });
        return;
      }
    }

    try {
      const res = await API.post("/expense/add", {
        amount: expenseAmount,
        category: category,
        date: date,
        description: description || "No description",
        userId: props.user?.id || 1
      });

      const expense = res.data?.expense ?? {
        id: res.data?.id || Date.now(),
        amount: expenseAmount,
        category: category,
        date: date,
        description: description || 'No description',
        userId: props.user?.id || 1
      };
      expense.type = 'expense';

      if (props.onAddExpense) {
        props.onAddExpense(expense);
      }

      setAmount('');
      setCategory('Food');
      setDate('');
      setDescription('');
      setBudgetWarning(null);
      setSuccess(true);
      setTimeout(function () { setSuccess(false); }, 2000);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.error || error?.response?.data?.message || "Error adding expense");
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Add Expense</h1>
        <p>Record a new expense transaction</p>
      </div>

      <div className="card form-card">
        {success && <div className="success-msg">Expense added successfully!</div>}

        {budgetWarning && (
          <div className="budget-warning-box">
            <div>
              <strong>Budget Exceeded</strong>
              <p>Category: {budgetWarning.category}</p>
              <p>Budget Limit: Rs.{Number(budgetWarning.budgetLimit).toLocaleString('en-IN')}</p>
              <p>Current Spending: Rs.{Number(budgetWarning.categorySpent).toLocaleString('en-IN')}</p>
              <p>New Expense: Rs.{Number(budgetWarning.expenseAmount).toLocaleString('en-IN')}</p>
              <p>Total: Rs.{Number(budgetWarning.totalAfterExpense).toLocaleString('en-IN')}</p>
              <small>Your expense exceeds the budget for this category.</small>
            </div>
            <div className="budget-warning-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={function () { setBudgetWarning(null); }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={function () {
                  navigate('/budget', {
                    state: {
                      category: budgetWarning.category,
                      suggestedLimit: budgetWarning.totalAfterExpense,
                    },
                  });
                }}
              >
                Set New Budget
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount (Rs.)</label>
            <input type="number" placeholder="Enter amount" value={amount} onChange={function (e) { setAmount(e.target.value); }} min="1" />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={function (e) { setCategory(e.target.value); }}>
              {categories.map(function (cat) {
                return <option key={cat} value={cat}>{cat}</option>;
              })}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={date} onChange={function (e) { setDate(e.target.value); }} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" placeholder="What was this expense for?" value={description} onChange={function (e) { setDescription(e.target.value); }} />
          </div>
          <button type="submit" className="btn-primary">Add Expense</button>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;
