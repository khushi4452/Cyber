import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!empId || !password) {
      setError('Please enter both Employee ID and Password');
      return;
    }

    setLoading(true);
    setError('');

    // ✅ Simulate login success
    setTimeout(() => {
      console.log("Login successful. Navigating to /device-check");
      setLoading(false);

      const role = empId === 'admin001' ? 'admin' : 'employee';
      localStorage.setItem('userRole', role); // Store user role
 
      navigate('/device-check'); // ✅ Redirect
    }, 1500);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>🚀 BYOD Secure Login</h2>
        <form onSubmit={handleLogin}>
          {error && <div className="login-error">{error}</div>}

          <input
            type="text"
            placeholder="Employee ID"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
          />

          <div className="password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
