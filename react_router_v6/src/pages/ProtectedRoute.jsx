import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("pulseToken");

  if (!token) {
    // If no token, send them to login
    return <Navigate to="/login" replace />;
  }

  // If token exists, show the page (children)
  return children;
};

