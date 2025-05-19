// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
    // Here you would typically authenticate with your backend API
    // For now, we'll just simulate a successful login
    alert('Login successful!');
    navigate('/'); // Redirect to homepage after successful login
  };

  return (
    <div className="login-container bg-[#3D1E0F] text-white" style={{ 
      maxWidth: '500px', 
      margin: '2rem auto', 
      padding: '2rem',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
      borderRadius: '8px'
    }}>
      <h1 className="text-[#CCBA78] font-['Special_Elite']" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Sign In</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label className="text-[#CCBA78]" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Email:
          </label>
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            className="bg-[#2A1509] border-[#CCBA78]"
            style={{ 
              width: '100%', 
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid',
              color: 'white'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="text-[#CCBA78]" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Password:
          </label>
          <input 
            type="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            className="bg-[#2A1509] border-[#CCBA78]"
            style={{ 
              width: '100%', 
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid',
              color: 'white'
            }}
            required
          />
        </div>
        
        <button 
          type="submit"
          className="bg-[#CCBA78] hover:bg-[#D8C78E] transition-colors"
          style={{
            width: '100%',
            padding: '0.75rem',
            color: '#3D1E0F',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Sign In
        </button>
        
        <div className="text-center mt-4">
          <p className="text-white">
            Don't have an account?{' '} 
            <Link to="/register" className="text-[#CCBA78] hover:text-white transition-colors">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;