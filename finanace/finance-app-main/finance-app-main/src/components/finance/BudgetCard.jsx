// BudgetCard - Shows budget status for one category
function BudgetCard(props) {
  // props: category, limit, spent
  var limit = props.limit || 0;
  var spent = props.spent || 0;
  var remaining = limit - spent;
  var percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

  var status = 'safe';
  if (percent >= 90) status = 'danger';
  else if (percent >= 70) status = 'warning';

  var statusText = status === 'danger' ? 'Over budget!' : status === 'warning' ? 'Approaching limit' : 'On track';

  return (
    <div className="budget-card">
      <div className="budget-cat">{props.category}</div>
      <div className="budget-row">
        <span>Budget Limit</span>
        <span>₹{Number(limit).toLocaleString('en-IN')}</span>
      </div>
      <div className="budget-row">
        <span>Spent</span>
        <span>₹{Number(spent).toLocaleString('en-IN')}</span>
      </div>
      <div className="budget-row">
        <span>Remaining</span>
        <span>₹{Number(remaining > 0 ? remaining : 0).toLocaleString('en-IN')}</span>
      </div>
      <div className="budget-progress-bg">
        <div className={`budget-progress-fill ${status}`} style={{ width: percent + '%' }}></div>
      </div>
      <div className={`budget-status ${status}`}>{statusText}</div>
    </div>
  );
}

export default BudgetCard;
