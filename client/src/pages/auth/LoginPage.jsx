import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser } from '../../services/auth_api';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Check for any messages passed through navigation state
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await loginUser(formData);
      
      // Store token in localStorage for future API requests
      localStorage.setItem('token', response.token);
      
      // Navigate to home page
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
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
      
      {error && (
        <div className="bg-red-700 text-white p-3 mb-4 rounded text-center">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-700 text-white p-3 mb-4 rounded text-center">
          {success}
        </div>
      )}
      
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
            disabled={loading}
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
            disabled={loading}
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
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
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