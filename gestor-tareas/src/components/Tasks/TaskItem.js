import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '../../context/TaskContext';
import './TasksStyles.css';

const TaskItem = ({ task }) => {
  const navigate = useNavigate();
  const { updateTask, deleteTask } = useTask();

  const handleEdit = () => {
    navigate(`/tasks/edit/${task.id}`);
  };

  const handleDelete = () => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta tarea?');
    if (confirmed) {
      const result = deleteTask(task.id);
      if (!result.success) {
        alert(result.message);
      }
    }
  };

  const handleToggleStatus = () => {
    let newStatus;
    if (task.estado === 'Pendiente') {
      newStatus = 'En progreso';
    } else if (task.estado === 'En progreso') {
      newStatus = 'Completada';
    } else {
      newStatus = 'Pendiente';
    }
    updateTask(task.id, { estado: newStatus });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPriorityClass = (prioridad) => {
    return `priority-badge priority-${prioridad.toLowerCase()}`;
  };

  const getStatusClass = (estado) => {
    return `status-badge status-${estado.toLowerCase().replace(' ', '-')}`;
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return '⭕';
      case 'En progreso':
        return '🔄';
      case 'Completada':
        return '✅';
      default:
        return '';
    }
  };

  return (
    <div className={`task-item card ${task.estado === 'Completada' ? 'task-completed' : ''}`}>
      <div className="task-header">
        <h3 className={`task-title ${task.estado === 'Completada' ? 'completed-title' : ''}`}>
          {task.titulo}
        </h3>
        <div className="task-badges">
          <span className={getPriorityClass(task.prioridad)}>
            {task.prioridad}
          </span>
          <span className={getStatusClass(task.estado)}>
            {getStatusIcon(task.estado)} {task.estado}
          </span>
        </div>
      </div>

      {task.descripcion && (
        <p className="task-description">{task.descripcion}</p>
      )}

      <div className="task-meta">
        <span className="task-date">
          📅 {formatDate(task.fechaVencimiento)}
        </span>
      </div>

      <div className="task-actions">
        <button
          onClick={handleToggleStatus}
          className="btn btn-status"
          title="Cambiar estado"
        >
          Cambiar Estado
        </button>
        <button
          onClick={handleEdit}
          className="btn btn-edit"
          title="Editar tarea"
        >
          ✏️ Editar
        </button>
        <button
          onClick={handleDelete}
          className="btn btn-delete"
          title="Eliminar tarea"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
