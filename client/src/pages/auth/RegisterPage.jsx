// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user' // Default role
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
    console.log('Registration submitted:', formData);
    // Here you would typically send the data to your backend API
    // For now, we'll just simulate a successful registration
    alert('Registration successful!');
    navigate('/login'); // Redirect to login page after successful registration
  };

  return (
    <div className="register-container bg-[#3D1E0F] text-white" style={{ 
      maxWidth: '500px', 
      margin: '2rem auto', 
      padding: '2rem',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
      borderRadius: '8px'
    }}>
      <h1 className="text-[#CCBA78] font-['Special_Elite']" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Register</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label className="text-[#CCBA78]" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            First Name:
          </label>
          <input 
            type="text" 
            name="firstName" 
            value={formData.firstName}
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
        
        <div style={{ marginBottom: '1rem' }}>
          <label className="text-[#CCBA78]" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Last Name:
          </label>
          <input 
            type="text" 
            name="lastName" 
            value={formData.lastName}
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
        
        <div style={{ marginBottom: '1rem' }}>
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
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="text-[#CCBA78]" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Role:
          </label>
          <select 
            name="role" 
            value={formData.role}
            onChange={handleChange}
            className="bg-[#2A1509] border-[#CCBA78]"
            style={{ 
              width: '100%', 
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid',
              color: 'white'
            }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>
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
          Register
        </button>
        
        <div className="text-center mt-4">
          <p className="text-white">
            Already have an account?{' '} 
            <Link to="/login" className="text-[#CCBA78] hover:text-white transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;