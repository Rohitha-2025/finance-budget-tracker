import { useState } from 'react';
import API from "../../services/api";

function Login(props) {

  var [email, setEmail] = useState('');
  var [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await API.post("/auth/login", {
        email: email,
        password: password
      });

      console.log(res.data);

      const data = res.data || {};
      const responseIsOk = res.status >= 200 && res.status < 300;
      const responseHasError = Boolean(data.error) || data.success === false;

      if (responseIsOk && !responseHasError) {
        const userData = data.user ?? {
          id: data.id,
          fullName: data.fullName || data.name || email,
          email: data.email || email,
          username: data.username || email,
          accountType: data.accountType || 'Personal',
        };

        if (props.onLogin) {
          props.onLogin(userData);
        }

        alert("Login Success ✅");
      } else {
        alert(data.error || data.message || "Login Failed ❌");
      }
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || error?.response?.data?.error || error.message || "Login Failed ❌";
      alert(message);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>💳 FinTrack</h2>
        <p className="subtitle">Sign in to manage your finances</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email / Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary">Login</button>
        </form>

        <div className="auth-link">
          Don't have an account?{' '}
          <span onClick={props.onGoToRegister}>Register here</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
