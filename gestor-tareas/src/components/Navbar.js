import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Solo mostrar el navbar si hay un usuario autenticado
  if (!currentUser) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>📝 Gestor de Tareas</h2>
        </div>
        
        <div className="navbar-user">
          <span className="user-greeting">
            Hola, <strong>{currentUser.username}</strong>
          </span>
          <button onClick={handleLogout} className="btn btn-logout">
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
