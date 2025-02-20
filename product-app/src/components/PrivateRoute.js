// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  const isAuthenticated = () => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
