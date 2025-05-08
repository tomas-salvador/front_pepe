import apiClient from './api';
import dataService from './dataService';

const login = async (username, password) => {
  try {
    const response = await apiClient.post('/login', { username, password });
    if (response.data.access_token) {
      localStorage.setItem('accessToken', response.data.access_token);
    }
    return response.data;
  } catch (error) {
    console.error("Error en servicio de login:", error.response?.data || error.message);
    throw error.response?.data || new Error('Error de red o servidor');
  }
};

const logout = () => {
  localStorage.removeItem('accessToken');
  dataService.clearCachedUserProfile(); // Limpia la caché específica del perfil
  console.log("Logged out and cleared tokens/cache.");
};

// Función para obtener el token actual
const getCurrentToken = () => {
    return localStorage.getItem('accessToken');
}


// Nota: La función de registro es más compleja por el archivo.
// Se manejaría directamente en el componente de registro usando FormData.
// const register = async (formData) => { ... }

const authService = {
  login,
  logout,
  getCurrentToken,
};

export default authService;