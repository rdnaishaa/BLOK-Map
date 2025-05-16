// src/pages/Login.jsx
import React, { useState } from 'react';

function Login() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user' // Default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your authentication logic here
  };

  return (
    <div className="login-container" style={{ 
      maxWidth: '500px', 
      margin: '0 auto', 
      padding: '2rem',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      backgroundColor: '#fff'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            First Name:
          </label>
          <input 
            type="text" 
            name="firstName" 
            value={formData.firstName}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Last Name:
          </label>
          <input 
            type="text" 
            name="lastName" 
            value={formData.lastName}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Email:
          </label>
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Password:
          </label>
          <input 
            type="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Role:
          </label>
          <select 
            name="role" 
            value={formData.role}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>
        
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Login;