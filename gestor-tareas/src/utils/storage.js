/**
 * Guarda un valor en localStorage
 * @param {string} key - La clave bajo la cual guardar el valor
 * @param {*} value - El valor a guardar (será convertido a JSON)
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
  }
};

/**
 * Obtiene un valor de localStorage
 * @param {string} key - La clave del valor a obtener
 * @returns {*} El valor parseado o null si no existe
 */
export const getFromStorage = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error al leer de localStorage:', error);
    return null;
  }
};

/**
 * Elimina un valor de localStorage
 * @param {string} key - La clave del valor a eliminar
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error al eliminar de localStorage:', error);
  }
};

/**
 * Limpia todo el localStorage
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error al limpiar localStorage:', error);
  }
};
