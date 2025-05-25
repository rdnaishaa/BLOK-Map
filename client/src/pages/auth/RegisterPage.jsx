import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/auth_api';
import Layout from '../../components/Layout';
import ImageSlider from '../../components/ImageSlider';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    // No need to expose role selection - all users register as 'user' by default
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

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
      // Send registration data to backend using auth_api
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: 'user' // Default role is always 'user'
      });
      
      // On successful registration, redirect to login page
      navigate('/login', { 
        state: { message: 'Registration successful! You can now log in.' } 
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col md:flex-row bg-[#3D1E0F]">
        {/* Kiri: ImageSlider */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-[#2A1509]">
          <div className="w-full max-w-lg p-8">
            <ImageSlider />
          </div>
        </div>
        {/* Kanan: Form Register */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md p-8 bg-[#3D1E0F] text-white rounded-xl shadow-xl">
            <h1 className="text-[#CCBA78] font-['Special_Elite'] text-center mb-6">Register</h1>
            
            {error && (
              <div className="bg-red-700 text-white p-3 mb-4 rounded text-center">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="text-[#CCBA78]" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Username:
                </label>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username}
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
              
              <div style={{ marginBottom: '1rem' }}>
                <label className="text-[#CCBA78]" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  First Name:
                </label>
                <input 
                  type="text" 
                  name="first_name" 
                  value={formData.first_name}
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
              
              <div style={{ marginBottom: '1rem' }}>
                <label className="text-[#CCBA78]" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Last Name:
                </label>
                <input 
                  type="text" 
                  name="last_name" 
                  value={formData.last_name}
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
                <div className="mt-1 text-xs text-gray-300">
                  Password must be at least 6 characters long, include a number, and a special character.
                </div>
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
                {loading ? 'Registering...' : 'Register'}
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
        </div>
      </div>
    </Layout>
  );
}

export default Register;