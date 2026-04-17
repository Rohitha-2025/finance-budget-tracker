import { useState } from 'react';
import API from "../../services/api";

// AddIncome - Form to add a new income
function AddIncome(props) {
  // props: onAddIncome
  var [amount, setAmount] = useState('');
  var [source, setSource] = useState('');
  var [date, setDate] = useState('');
  var [description, setDescription] = useState('');
  var [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount || !source || !date) return;

    const incomeAmount = Number(amount);

    try {
      const res = await API.post("/income/add", {
        amount: incomeAmount,
        source: source,
        date: date,
        description: description || "No description",
        userId: props.user?.id || 1
      });

      const income = res.data?.income ?? {
        id: res.data?.id || Date.now(),
        amount: incomeAmount,
        source: source,
        date: date,
        description: description || 'No description',
        userId: props.user?.id || 1
      };
      income.type = 'income';
      income.category = income.source;

      if (props.onAddIncome) {
        props.onAddIncome(income);
      }

      setAmount('');
      setSource('');
      setDate('');
      setDescription('');
      setSuccess(true);
      setTimeout(function () { setSuccess(false); }, 2000);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.error || error?.response?.data?.message || "Error adding income");
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Add Income</h1>
        <p>Record a new income transaction</p>
      </div>

      <div className="card form-card">
        {success && <div className="success-msg">✅ Income added successfully!</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount (₹)</label>
            <input type="number" placeholder="Enter amount" value={amount} onChange={function (e) { setAmount(e.target.value); }} min="1" />
          </div>
          <div className="form-group">
            <label>Source</label>
            <input type="text" placeholder="e.g. Salary, Freelance, Gift" value={source} onChange={function (e) { setSource(e.target.value); }} />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={date} onChange={function (e) { setDate(e.target.value); }} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" placeholder="Additional details" value={description} onChange={function (e) { setDescription(e.target.value); }} />
          </div>
          <button type="submit" className="btn-primary">Add Income</button>
        </form>
      </div>
    </div>
  );
}

export default AddIncome;
