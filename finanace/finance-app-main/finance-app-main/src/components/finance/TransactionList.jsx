// TransactionList - Shows a list of recent transactions
function TransactionList(props) {
  // props: transactions (array of { id, type, category, amount, date, description })
  const transactions = props.transactions || [];

  if (transactions.length === 0) {
    return <p style={{ color: '#a0aec0', fontSize: '14px' }}>No transactions yet.</p>;
  }

  return (
    <ul className="transaction-list">
      {transactions.map(function (txn) {
        return (
          <li className="transaction-item" key={txn.id}>
            <div className="transaction-info">
              <div className="txn-category">{txn.category || txn.source}</div>
              <div className="txn-date">{txn.date} — {txn.description}</div>
            </div>
            <div className={`transaction-amount ${txn.type === 'income' ? 'income-amount' : 'expense-amount'}`}>
              {txn.type === 'income' ? '+' : '-'}₹{Number(txn.amount).toLocaleString('en-IN')}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default TransactionList;
