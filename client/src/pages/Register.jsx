// src/pages/Register.jsx
import React from 'react';

function Register() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Register Page</h1>
      <form>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Email:
            <input type="email" name="email" />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Password:
            <input type="password" name="password" />
          </label>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
