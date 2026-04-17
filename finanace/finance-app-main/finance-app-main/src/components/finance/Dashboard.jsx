import SummaryCard from './SummaryCard';
import TransactionList from './TransactionList';
import { useNavigate } from 'react-router-dom';

// Dashboard - Main overview page
function Dashboard(props) {
  // props: transactions, budgets
  const navigate = useNavigate();
  var transactions = props.transactions || [];
  var budgets = props.budgets || [];

  // Calculate totals
  var totalIncome = 0;
  var totalExpense = 0;
  var categorySpending = {};

  transactions.forEach(function (txn) {
    if (txn.type === 'income') {
      totalIncome += txn.amount;
    } else {
      totalExpense += txn.amount;
      var cat = txn.category || 'Others';
      categorySpending[cat] = (categorySpending[cat] || 0) + txn.amount;
    }
  });

  var balance = totalIncome - totalExpense;

  // Total budget
  var totalBudget = budgets.reduce(function (sum, b) { return sum + b.limit; }, 0);

  var exceededBudgets = budgets
    .map(function (budget) {
      var limit = Number(budget.limit ?? budget.limitAmount ?? 0);
      var spent = Number(categorySpending[budget.category] || 0);

      return {
        category: budget.category,
        limit: limit,
        spent: spent,
        overBy: spent - limit,
      };
    })
    .filter(function (budget) {
      return budget.limit > 0 && budget.spent > budget.limit;
    });

  // Recent transactions (last 5)
  var recent = transactions.slice(-5).reverse();

  // Max category spending for bar width
  var maxCat = Math.max.apply(null, Object.values(categorySpending).concat([1]));

  var barColors = {
    Food: 'bar-food',
    Travel: 'bar-travel',
    Bills: 'bar-bills',
    Shopping: 'bar-shopping',
    Entertainment: 'bar-entertainment',
    Others: 'bar-others',
  };

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome {props.user?.fullName ? props.user.fullName : 'User'}, your financial overview at a glance</p>
      </div>

      {exceededBudgets.length > 0 && (
        <div className="budget-alert-bar">
          <div>
            <strong>Budget exceeded</strong>
            <p>
              {exceededBudgets[0].category} is over budget by ₹{Number(exceededBudgets[0].overBy).toLocaleString('en-IN')}.
              Set a new budget to keep tracking clearly.
            </p>
          </div>
          <button type="button" onClick={function () { navigate('/budget'); }}>
            Set New Budget
          </button>
        </div>
      )}

      <div className="summary-grid">
        <SummaryCard label="Total Income" amount={totalIncome} type="income" />
        <SummaryCard label="Total Expenses" amount={totalExpense} type="expense" />
        <SummaryCard label="Balance" amount={balance} type="balance" />
        <SummaryCard label="Monthly Budget" amount={totalBudget} type="budget" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <h3>Recent Transactions</h3>
          <TransactionList transactions={recent} />
        </div>

        <div className="card">
          <h3>Category-wise Spending</h3>
          {Object.keys(categorySpending).length === 0 && (
            <p style={{ color: '#a0aec0', fontSize: '14px' }}>No spending data yet.</p>
          )}
          {Object.keys(categorySpending).map(function (cat) {
            var pct = (categorySpending[cat] / maxCat) * 100;
            return (
              <div className="category-bar-container" key={cat}>
                <div className="category-bar-header">
                  <span className="cat-name">{cat}</span>
                  <span className="cat-amount">₹{Number(categorySpending[cat]).toLocaleString('en-IN')}</span>
                </div>
                <div className="category-bar-bg">
                  <div
                    className={`category-bar-fill ${barColors[cat] || 'bar-others'}`}
                    style={{ width: pct + '%' }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
