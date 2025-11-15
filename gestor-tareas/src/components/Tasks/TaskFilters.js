import React from 'react';
import './TasksStyles.css';

const TaskFilters = ({
  searchText,
  setSearchText,
  filterEstado,
  setFilterEstado,
  filterPrioridad,
  setFilterPrioridad,
  onClearFilters
}) => {
  return (
    <div className="task-filters card">
      <div className="filters-row">
        <div className="filter-group">
          <label htmlFor="search" className="filter-label">
            🔍 Buscar
          </label>
          <input
            type="text"
            id="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="form-control"
            placeholder="Buscar por título o descripción..."
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filterEstado" className="filter-label">
            Estado
          </label>
          <select
            id="filterEstado"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="form-control"
          >
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En progreso">En progreso</option>
            <option value="Completada">Completada</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filterPrioridad" className="filter-label">
            Prioridad
          </label>
          <select
            id="filterPrioridad"
            value={filterPrioridad}
            onChange={(e) => setFilterPrioridad(e.target.value)}
            className="form-control"
          >
            <option value="">Todos</option>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </div>

        <div className="filter-group filter-actions">
          <button
            onClick={onClearFilters}
            className="btn btn-secondary btn-clear"
            title="Limpiar filtros"
          >
            🔄 Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
