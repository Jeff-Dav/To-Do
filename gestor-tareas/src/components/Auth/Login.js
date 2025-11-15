import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthStyles.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Intentar iniciar sesión
    const result = login(formData.username, formData.password);
    
    if (result.success) {
      // Redirigir a la página de tareas
      navigate('/tasks');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Iniciar Sesión</h1>
        <p className="auth-subtitle">Accede a tu cuenta de tareas</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Nombre de usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              placeholder="Ingresa tu nombre de usuario"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block">
            Iniciar sesión
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes cuenta? <Link to="/register" className="auth-link">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
