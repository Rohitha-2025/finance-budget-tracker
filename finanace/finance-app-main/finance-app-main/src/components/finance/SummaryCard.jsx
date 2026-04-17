// SummaryCard - Displays a single summary metric (income, expense, balance, budget)
function SummaryCard(props) {
  // props: label, amount, type (income | expense | balance | budget)
  return (
    <div className={`summary-card ${props.type || ''}`}>
      <div className="card-label">{props.label}</div>
      <div className="card-amount">₹{Number(props.amount).toLocaleString('en-IN')}</div>
    </div>
  );
}

export default SummaryCard;
