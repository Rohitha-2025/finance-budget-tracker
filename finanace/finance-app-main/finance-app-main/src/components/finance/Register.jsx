import { useState } from 'react';
import API from "../../services/api";

function Register(props) {

  var [fullName, setFullName] = useState('');
  var [email, setEmail] = useState('');
  var [username, setUsername] = useState('');
  var [password, setPassword] = useState('');
  var [confirmPassword, setConfirmPassword] = useState('');
  var [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (!fullName || !email || !username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await API.post("/auth/register", {
        name: fullName,
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword
      });

      console.log(res.data);

      if (res.status >= 200 && res.status < 300 && !res.data?.error) {
        if (props.onRegister) {
          props.onRegister({ fullName, email, username });
        }
        alert("Registered Successfully ✅");
      } else {
        alert(res.data?.error || res.data?.message || "Registration Failed ❌");
      }
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || error?.response?.data?.error || error.message || "Registration Failed ❌";
      alert(message);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">Start tracking your finances today</p>

        {error && <div style={{ color: '#c53030', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          <button type="submit" className="btn-primary">Register</button>
        </form>

        <div className="auth-link">
          Already have an account?{' '}
          <span onClick={props.onGoToLogin}>Login here</span>
        </div>
      </div>
    </div>
  );
}

export default Register;