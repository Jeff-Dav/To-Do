import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '../../context/TaskContext';
import TaskItem from './TaskItem';
import TaskFilters from './TaskFilters';
import './TasksStyles.css';

const TaskList = () => {
  const navigate = useNavigate();
  const { tasks, isLoading } = useTask();
  
  const [searchText, setSearchText] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterPrioridad, setFilterPrioridad] = useState('');

  const handleNewTask = () => {
    navigate('/tasks/new');
  };

  // Aplicar filtros
  const filteredTasks = tasks.filter(task => {
    // Filtro de búsqueda por texto
    const matchesSearch = searchText === '' || 
      task.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
      task.descripcion.toLowerCase().includes(searchText.toLowerCase());

    // Filtro por estado
    const matchesEstado = filterEstado === '' || task.estado === filterEstado;

    // Filtro por prioridad
    const matchesPrioridad = filterPrioridad === '' || task.prioridad === filterPrioridad;

    return matchesSearch && matchesEstado && matchesPrioridad;
  });

  // Agrupar tareas por estado
  const tasksByEstado = {
    'Pendiente': filteredTasks.filter(t => t.estado === 'Pendiente'),
    'En progreso': filteredTasks.filter(t => t.estado === 'En progreso'),
    'Completada': filteredTasks.filter(t => t.estado === 'Completada')
  };

  const handleClearFilters = () => {
    setSearchText('');
    setFilterEstado('');
    setFilterPrioridad('');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Cargando tareas...</p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h1>Mis Tareas</h1>
        <button onClick={handleNewTask} className="btn btn-primary">
          ➕ Nueva Tarea
        </button>
      </div>

      <TaskFilters
        searchText={searchText}
        setSearchText={setSearchText}
        filterEstado={filterEstado}
        setFilterEstado={setFilterEstado}
        filterPrioridad={filterPrioridad}
        setFilterPrioridad={setFilterPrioridad}
        onClearFilters={handleClearFilters}
      />

      <div className="tasks-stats">
        <span className="stat-item">
          Total: <strong>{filteredTasks.length}</strong>
        </span>
        <span className="stat-item">
          Pendientes: <strong>{tasksByEstado['Pendiente'].length}</strong>
        </span>
        <span className="stat-item">
          En progreso: <strong>{tasksByEstado['En progreso'].length}</strong>
        </span>
        <span className="stat-item">
          Completadas: <strong>{tasksByEstado['Completada'].length}</strong>
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state card">
          <h2>📝 No hay tareas</h2>
          <p>¡Comienza creando tu primera tarea!</p>
          <button onClick={handleNewTask} className="btn btn-primary">
            Crear primera tarea
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state card">
          <h2>🔍 No se encontraron tareas</h2>
          <p>Prueba con otros filtros o búsqueda</p>
          <button onClick={handleClearFilters} className="btn btn-secondary">
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="tasks-sections">
          {Object.entries(tasksByEstado).map(([estado, estadoTasks]) => (
            estadoTasks.length > 0 && (
              <div key={estado} className="task-section">
                <h2 className="section-title">
                  {estado} ({estadoTasks.length})
                </h2>
                <div className="tasks-grid">
                  {estadoTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
