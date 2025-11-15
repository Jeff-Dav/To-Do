import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTask } from '../../context/TaskContext';
import './TasksStyles.css';

const TaskForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createTask, updateTask, getTaskById } = useTask();
  
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaVencimiento: '',
    prioridad: 'Media'
  });
  
  const [error, setError] = useState('');

  // Cargar datos si estamos editando
  useEffect(() => {
    if (isEditing) {
      const task = getTaskById(id);
      if (task) {
        setFormData({
          titulo: task.titulo,
          descripcion: task.descripcion,
          fechaVencimiento: task.fechaVencimiento,
          prioridad: task.prioridad
        });
      } else {
        // Si no se encuentra la tarea, redirigir
        navigate('/tasks');
      }
    }
  }, [id, isEditing, getTaskById, navigate]);

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

    let result;
    if (isEditing) {
      result = updateTask(id, formData);
    } else {
      result = createTask(formData);
    }

    if (result.success) {
      navigate('/tasks');
    } else {
      setError(result.message);
    }
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  return (
    <div className="task-form-container">
      <div className="task-form-card card">
        <h2 className="task-form-title">
          {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
        </h2>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="titulo" className="form-label">
              Título <span className="required">*</span>
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="form-control"
              placeholder="Ej: Comprar víveres"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion" className="form-label">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="form-control"
              rows="4"
              placeholder="Describe los detalles de tu tarea..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fechaVencimiento" className="form-label">
                Fecha de vencimiento
              </label>
              <input
                type="date"
                id="fechaVencimiento"
                name="fechaVencimiento"
                value={formData.fechaVencimiento}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="prioridad" className="form-label">
                Prioridad <span className="required">*</span>
              </label>
              <select
                id="prioridad"
                name="prioridad"
                value={formData.prioridad}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Actualizar' : 'Crear'} Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
