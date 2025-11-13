import React, { createContext, useState, useContext, useEffect } from 'react';
import { saveToStorage, getFromStorage } from '../utils/storage';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask debe ser usado dentro de un TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar tareas cuando el usuario cambia
  useEffect(() => {
    if (currentUser) {
      loadTasks();
    } else {
      setTasks([]);
    }
  }, [currentUser]);

  /**
   * Genera la clave de localStorage para las tareas del usuario
   */
  const getTasksKey = () => {
    if (!currentUser) return null;
    return `tasks_${currentUser.id}`;
  };

  /**
   * Carga las tareas del usuario actual desde localStorage
   */
  const loadTasks = () => {
    try {
      setIsLoading(true);
      const tasksKey = getTasksKey();
      if (!tasksKey) {
        setTasks([]);
        return;
      }

      const userTasks = getFromStorage(tasksKey) || [];
      setTasks(userTasks);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Guarda las tareas en localStorage
   * @param {Array} updatedTasks - Array de tareas actualizado
   */
  const saveTasks = (updatedTasks) => {
    const tasksKey = getTasksKey();
    if (tasksKey) {
      saveToStorage(tasksKey, updatedTasks);
    }
  };

  /**
   * Crea una nueva tarea
   * @param {Object} taskData - Datos de la tarea (titulo, descripcion, fechaVencimiento, prioridad)
   * @returns {Object} - { success: boolean, message: string, task?: Object }
   */
  const createTask = (taskData) => {
    try {
      if (!currentUser) {
        return { success: false, message: 'Usuario no autenticado' };
      }

      // Validaciones
      if (!taskData.titulo || taskData.titulo.trim() === '') {
        return { success: false, message: 'El título es requerido' };
      }

      // Crear nueva tarea
      const newTask = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: currentUser.id,
        titulo: taskData.titulo.trim(),
        descripcion: taskData.descripcion?.trim() || '',
        fechaVencimiento: taskData.fechaVencimiento || '',
        prioridad: taskData.prioridad || 'Media',
        estado: 'Pendiente',
        createdAt: Date.now()
      };

      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);

      return { 
        success: true, 
        message: 'La tarea fue creada exitosamente',
        task: newTask
      };
    } catch (error) {
      console.error('Error al crear tarea:', error);
      return { success: false, message: 'Error al crear la tarea' };
    }
  };

  /**
   * Actualiza una tarea existente
   * @param {string} taskId - ID de la tarea a actualizar
   * @param {Object} updates - Campos a actualizar
   * @returns {Object} - { success: boolean, message: string }
   */
  const updateTask = (taskId, updates) => {
    try {
      if (!currentUser) {
        return { success: false, message: 'Usuario no autenticado' };
      }

      // Validar que el título no esté vacío si se está actualizando
      if (updates.titulo !== undefined && updates.titulo.trim() === '') {
        return { success: false, message: 'El título es requerido' };
      }

      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) {
        return { success: false, message: 'Tarea no encontrada' };
      }

      // Verificar que la tarea pertenece al usuario
      if (tasks[taskIndex].userId !== currentUser.id) {
        return { success: false, message: 'No autorizado' };
      }

      // Actualizar tarea
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        ...updates,
        // Limpiar campos de texto si existen
        titulo: updates.titulo ? updates.titulo.trim() : updatedTasks[taskIndex].titulo,
        descripcion: updates.descripcion !== undefined 
          ? updates.descripcion.trim() 
          : updatedTasks[taskIndex].descripcion
      };

      setTasks(updatedTasks);
      saveTasks(updatedTasks);

      return { success: true, message: 'La tarea fue actualizada exitosamente' };
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      return { success: false, message: 'Error al actualizar la tarea' };
    }
  };

  /**
   * Elimina una tarea
   * @param {string} taskId - ID de la tarea a eliminar
   * @returns {Object} - { success: boolean, message: string }
   */
  const deleteTask = (taskId) => {
    try {
      if (!currentUser) {
        return { success: false, message: 'Usuario no autenticado' };
      }

      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        return { success: false, message: 'Tarea no encontrada' };
      }

      // Verificar que la tarea pertenece al usuario
      if (task.userId !== currentUser.id) {
        return { success: false, message: 'No autorizado' };
      }

      const updatedTasks = tasks.filter(t => t.id !== taskId);
      setTasks(updatedTasks);
      saveTasks(updatedTasks);

      return { success: true, message: 'La tarea fue eliminada' };
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      return { success: false, message: 'Error al eliminar la tarea' };
    }
  };

  /**
   * Obtiene una tarea por su ID
   * @param {string} taskId - ID de la tarea
   * @returns {Object|null} - La tarea o null si no se encuentra
   */
  const getTaskById = (taskId) => {
    return tasks.find(t => t.id === taskId) || null;
  };

  const value = {
    tasks,
    isLoading,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
