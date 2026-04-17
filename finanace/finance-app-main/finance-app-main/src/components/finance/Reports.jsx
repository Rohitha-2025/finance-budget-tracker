import ReportTable from './ReportTable';

function getCurrentMonthKey() {
  var now = new Date();
  var year = now.getFullYear();
  var month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function getCurrentMonthLabel() {
  return new Date().toLocaleString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
}

function Reports(props) {
  var transactions = props.transactions || [];
  var currentMonth = getCurrentMonthKey();
  var currentMonthLabel = getCurrentMonthLabel();

  var currentMonthExpenses = transactions.filter(function (txn) {
    return txn.type === 'expense' && txn.date && txn.date.substring(0, 7) === currentMonth;
  });

  var categorySpending = {};
  var totalExpense = 0;
  currentMonthExpenses.forEach(function (txn) {
    var cat = txn.category || 'Others';
    var amount = Number(txn.amount);
    categorySpending[cat] = (categorySpending[cat] || 0) + amount;
    totalExpense += amount;
  });

  var monthlySpending = {};
  monthlySpending[currentMonth] = totalExpense;
  var months = totalExpense > 0 ? [currentMonth] : [];
  var maxMonthly = Math.max.apply(null, Object.values(monthlySpending).concat([1]));

  var catColumns = ['Category', 'Amount (Rs.)', '% of Total'];
  var catRows = Object.keys(categorySpending).map(function (cat) {
    var amt = categorySpending[cat];
    var pct = totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(1) + '%' : '0%';
    return [cat, 'Rs.' + Number(amt).toLocaleString('en-IN'), pct];
  });

  var barColorList = ['#22c55e', '#facc15', '#ef4444'];
  var catKeys = Object.keys(categorySpending);
  var maxCat = Math.max.apply(null, Object.values(categorySpending).concat([1]));
  var pieStart = 0;
  var pieSegments = catKeys.map(function (cat, i) {
    var amount = categorySpending[cat];
    var percent = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
    var segment = {
      category: cat,
      amount: amount,
      percent: percent,
      color: barColorList[i % barColorList.length],
      start: pieStart,
      end: pieStart + percent,
    };
    pieStart += percent;
    return segment;
  });
  var pieGradient = pieSegments.length > 0
    ? pieSegments.map(function (segment) {
        return `${segment.color} ${segment.start}% ${segment.end}%`;
      }).join(', ')
    : '#edf2f7 0% 100%';

  return (
    <div>
      <div className="page-header">
        <h1>Reports</h1>
        <p>Analyze your spending patterns for {currentMonthLabel}</p>
      </div>

      <div className="card">
        <h3>Current Month Spending</h3>
        {months.length === 0 ? (
          <p style={{ color: '#a0aec0', fontSize: '14px' }}>No expense data for {currentMonthLabel}.</p>
        ) : (
          <div className="bar-chart">
            {months.map(function (m, i) {
              var height = (monthlySpending[m] / maxMonthly) * 160;
              return (
                <div className="bar-col" key={m}>
                  <div className="bar-value">Rs.{Number(monthlySpending[m]).toLocaleString('en-IN')}</div>
                  <div
                    className="bar-fill"
                    style={{
                      height: height + 'px',
                      background: barColorList[i % barColorList.length],
                    }}
                  ></div>
                  <div className="bar-label">{currentMonthLabel}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Category-wise Spending for {currentMonthLabel}</h3>
        {catKeys.length === 0 ? (
          <p style={{ color: '#a0aec0', fontSize: '14px' }}>No spending data for {currentMonthLabel}.</p>
        ) : (
          <>
            {catKeys.map(function (cat, i) {
              var pct = (categorySpending[cat] / maxCat) * 100;
              return (
                <div className="category-bar-container" key={cat}>
                  <div className="category-bar-header">
                    <span className="cat-name">{cat}</span>
                    <span className="cat-amount">Rs.{Number(categorySpending[cat]).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="category-bar-bg">
                    <div
                      className="category-bar-fill"
                      style={{ width: pct + '%', background: barColorList[i % barColorList.length] }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className="card">
        <h3>{currentMonthLabel} Expense Pie Chart</h3>
        {pieSegments.length === 0 ? (
          <p style={{ color: '#a0aec0', fontSize: '14px' }}>No expense data for {currentMonthLabel}.</p>
        ) : (
          <div className="pie-report-layout">
            <div
              className="expense-pie-chart"
              style={{ background: `conic-gradient(${pieGradient})` }}
              aria-label={`${currentMonthLabel} expense pie chart`}
            >
              <div className="pie-chart-center">
                <span>Total</span>
                <strong>Rs.{Number(totalExpense).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="pie-legend">
              {pieSegments.map(function (segment) {
                return (
                  <div className="pie-legend-item" key={segment.category}>
                    <span className="pie-legend-color" style={{ background: segment.color }}></span>
                    <span className="pie-legend-name">{segment.category}</span>
                    <span className="pie-legend-value">
                      Rs.{Number(segment.amount).toLocaleString('en-IN')} ({segment.percent.toFixed(1)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3>{currentMonthLabel} Expense Breakdown</h3>
        {catRows.length === 0 ? (
          <p style={{ color: '#a0aec0', fontSize: '14px' }}>No data available for {currentMonthLabel}.</p>
        ) : (
          <ReportTable columns={catColumns} rows={catRows} />
        )}
      </div>
    </div>
  );
}

export default Reports;
