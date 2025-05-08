import axios from 'axios';

// Crea una instancia de Axios con la URL base de tu API Flask
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://193.70.74.126:8070', // Fallback por si .env no carga
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT a las cabeceras de las peticiones protegidas
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Guardamos el token aquí
    if (token) {
      // No añadir token a rutas públicas como /login o /register
      if (!config.url.endsWith('/login') && !config.url.endsWith('/register')) {
           config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas (útil para manejo global de errores 401)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado
      console.error("Error 401: No autorizado. Redirigiendo a login...");
      localStorage.removeItem('accessToken'); // Limpiar token viejo
      // Redirigir a login (mejor hacerlo en el componente que llama)
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export default apiClient;