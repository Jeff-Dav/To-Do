import React, { createContext, useState, useContext, useEffect } from 'react';
import { saveToStorage, getFromStorage, removeFromStorage } from '../utils/storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inicializar autenticación al montar el componente
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Inicializa la autenticación cargando el usuario actual desde localStorage
   */
  const initializeAuth = () => {
    try {
      const user = getFromStorage('currentUser');
      setCurrentUser(user);
    } catch (err) {
      console.error('Error al inicializar autenticación:', err);
      setError('Error al cargar la sesión');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Registra un nuevo usuario
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Object} - { success: boolean, message: string }
   */
  const register = (username, password) => {
    try {
      setError(null);

      // Validaciones
      if (!username || !password) {
        const errorMsg = 'Todos los campos son requeridos';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

      if (password.length < 6) {
        const errorMsg = 'La contraseña debe tener al menos 6 caracteres';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

      // Obtener usuarios existentes
      const users = getFromStorage('users') || [];

      // Verificar si el usuario ya existe
      const userExists = users.find(user => user.username === username);
      if (userExists) {
        const errorMsg = 'El nombre de usuario ya existe';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

      // Crear nuevo usuario
      const newUser = {
        id: `user_${Date.now()}`,
        username,
        password // En producción debería estar hasheado
      };

      // Guardar usuario
      users.push(newUser);
      saveToStorage('users', users);

      return { success: true, message: 'Registro exitoso. Ahora inicia sesión' };
    } catch (err) {
      console.error('Error en registro:', err);
      const errorMsg = 'Error al registrar usuario';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  /**
   * Inicia sesión con un usuario existente
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Object} - { success: boolean, message: string }
   */
  const login = (username, password) => {
    try {
      setError(null);

      // Validaciones
      if (!username || !password) {
        const errorMsg = 'Todos los campos son requeridos';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

      // Obtener usuarios
      const users = getFromStorage('users') || [];

      // Buscar usuario
      const user = users.find(
        u => u.username === username && u.password === password
      );

      if (!user) {
        const errorMsg = 'Usuario o contraseña inválidos';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

      // Guardar usuario actual (sin la contraseña)
      const userSession = {
        id: user.id,
        username: user.username
      };

      saveToStorage('currentUser', userSession);
      setCurrentUser(userSession);

      return { success: true, message: 'Inicio de sesión exitoso' };
    } catch (err) {
      console.error('Error en login:', err);
      const errorMsg = 'Error al iniciar sesión';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  /**
   * Cierra la sesión del usuario actual
   */
  const logout = () => {
    try {
      removeFromStorage('currentUser');
      setCurrentUser(null);
      setError(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      setError('Error al cerrar sesión');
    }
  };

  const value = {
    currentUser,
    isLoading,
    error,
    register,
    login,
    logout,
    initializeAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
