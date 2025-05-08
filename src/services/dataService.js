import apiClient from './api';
 

const USER_PROFILE_KEY = 'userProfileData';

// Obtener datos del usuario logueado desde el backend (/user/me)
const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/user/me');
    if (response.data) {
      // Guarda los datos esenciales en localStorage
      try {
          // Guarda solo lo necesario (nombre, url del logo, email)
          const profileToStore = {
              name: response.data.name,
              company_logo_url: response.data.company_logo_url, // La URL relativa que da Flask
              email: response.data.email,
          };
          localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profileToStore));
          console.log("User profile saved to localStorage:", profileToStore);
      } catch (error) {
          console.error("Error saving user profile to localStorage:", error);
      }
    }
    return response.data; // Devuelve los datos completos de la API
  } catch (error) {
    console.error("Error getting user profile from API:", error.response?.data || error.message);
    // Si es 401, el interceptor ya lo podría haber manejado
    throw error.response?.data || new Error('Error fetching user profile');
  }
};

// Función para obtener los datos cacheados de localStorage
const getCachedUserProfile = () => {
    try {
        const cachedData = localStorage.getItem(USER_PROFILE_KEY);
        if (cachedData) {
            console.log("Retrieved user profile from localStorage cache.");
            return JSON.parse(cachedData);
        }
    } catch (error) {
         console.error("Error reading user profile from localStorage:", error);
    }
    console.log("No cached user profile found in localStorage.");
    return null; // Devuelve null si no hay caché o hay error
};

// Función para limpiar la caché del perfil (útil al hacer logout)
const clearCachedUserProfile = () => {
    try {
        localStorage.removeItem(USER_PROFILE_KEY);
        console.log("Cleared user profile cache from localStorage.");
    } catch (error) {
        console.error("Error clearing user profile cache:", error);
    }
};

// esto es de prueba para mas adelante que nos devuelva el jsons que necesitamos
const getAnalyticsSummary = async () => {
  try {
    const response = await apiClient.get('/analytics/summary');
    return response.data;
  } catch (error) {
    console.error("Error obteniendo resumen de analíticas:", error.response?.data || error.message);
     // Si es 401, el interceptor ya lo podría haber manejado
    throw error.response?.data || new Error('Error de red o servidor');
  }
};


const dataService = {
  getUserProfile,
  getAnalyticsSummary, 
  getCachedUserProfile, 
  clearCachedUserProfile 
};

export default dataService;