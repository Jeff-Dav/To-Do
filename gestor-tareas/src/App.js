import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TaskList from './components/Tasks/TaskList';
import TaskForm from './components/Tasks/TaskForm';
import ProtectedRoute from './components/ProtectedRoute';

// Componente para redirigir la ruta raíz
const RootRedirect = () => {
  const { currentUser, isLoading } = useAuth();

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

  return currentUser ? <Navigate to="/tasks" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <div className="App">
            <Navbar />
            <Routes>
              {/* Ruta raíz - redirige según autenticación */}
              <Route path="/" element={<RootRedirect />} />
              
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rutas protegidas */}
              <Route 
                path="/tasks" 
                element={
                  <ProtectedRoute>
                    <TaskList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks/new" 
                element={
                  <ProtectedRoute>
                    <TaskForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks/edit/:id" 
                element={
                  <ProtectedRoute>
                    <TaskForm />
                  </ProtectedRoute>
                } 
              />
              
              {/* Ruta 404 - redirigir a raíz */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
