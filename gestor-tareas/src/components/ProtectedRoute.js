import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#6C757D'
      }}>
        Cargando...
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar el componente
  return children;
};

export default ProtectedRoute;
