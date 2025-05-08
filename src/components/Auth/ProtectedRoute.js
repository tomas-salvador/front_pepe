import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../../services/authService';

const ProtectedRoute = () => {
  const token = authService.getCurrentToken();

  // Si no hay token, redirige a la página de login
  // `replace` evita que el usuario pueda volver atrás a la ruta protegida
  if (!token) {
    console.log("ProtectedRoute: No token found, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  // Si hay token, renderiza el componente hijo (la página solicitada)
  // <Outlet /> renderiza el componente que coincide con la ruta anidada
  return <Outlet />;
};

export default ProtectedRoute;