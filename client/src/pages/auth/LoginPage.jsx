import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/Layout';
import ImageSlider from '../../components/ImageSlider';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }

    // Focus input saat halaman dimuat
    document.getElementById('email-input')?.focus();
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email.');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);

      // Perbaikan: result bisa berupa {success, error} atau langsung userData
      if (result && result.success) {
        // If login was successful, redirect
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else if (result && result.error) {
        setError(result.error || 'Login failed. Please check your credentials.');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      // Tangkap error dari backend jika ada
      if (err.response && err.response.data) {
        setError(
          err.response.data.message ||
          err.response.data.error ||
          'Internal Server Error'
        );
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
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
        {/* Kanan: Form Login */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md p-8 bg-[#3D1E0F] text-white rounded-xl shadow-xl">
            <h1 className="text-[#CCBA78] font-['Special_Elite'] text-center mb-6">
              Sign In
            </h1>

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
              <div className="mb-4">
                <label
                  htmlFor="email-input"
                  className="text-[#CCBA78] block mb-2 font-medium"
                >
                  Email:
                </label>
                <input
                  id="email-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-[#2A1509] border-[#CCBA78] w-full p-3 rounded border text-white"
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password-input"
                  className="text-[#CCBA78] block mb-2 font-medium"
                >
                  Password:
                </label>
                <div className="relative">
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-[#2A1509] border-[#CCBA78] w-full p-3 rounded border text-white pr-16"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#CCBA78] hover:text-white"
                    tabIndex={-1}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#CCBA78] hover:bg-[#D8C78E] w-full p-3 rounded text-[#3D1E0F] font-bold text-lg transition-colors disabled:opacity-70"
                disabled={loading || !formData.email || !formData.password}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="text-center mt-4">
                <p>
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-[#CCBA78] hover:text-white transition-colors"
                  >
                    Register
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

export default Login;