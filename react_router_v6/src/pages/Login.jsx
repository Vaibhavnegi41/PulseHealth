import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../Api/api';
// Import only the icons we need
import { LogIn, LogOut } from 'lucide-react';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("pulseToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post("/login", formData);
      const token = response.data.access_token;
      
      localStorage.setItem("pulseToken", token);
      localStorage.setItem("userEmail",formData.email)
      setIsLoggedIn(true);

      navigate('/'); 

    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("pulseToken");
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="login-container">
      {isLoggedIn ? (
        <div className="login-form logout-view" style={{ textAlign: 'center' }}>
          <h2>Welcome Back To <span className='pump-heading'>PulseHealth</span></h2>
          <p>You are currently logged in.</p>
          
          {/* LOGOUT BUTTON WITH ICON */}
          <button onClick={handleLogout} className="login-button icon-btn">
            <LogOut size={20} /> Logout
          </button>
        </div>
      ) : (
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Welcome Back To <span className="footer-heart">❤️</span>Pulse<span className='pump-heading'>Health </span> </h2>
          <p>Please enter your login details</p>
          
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Enter your password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          {/* LOGIN BUTTON WITH ICON */}
          <button type="submit" className="login-button icon-btn" disabled={loading}>
            {loading ? "..." : <><LogIn size={20} />Login </>}
          </button>
          
          <div className="form-footer">
            <span>Don't have an account? <Link to="/signup">Sign Up</Link></span>
          </div>
        </form>
      )}
    </div>
  );
};