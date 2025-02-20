import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProductPage from './pages/ProductPage';
import PrivateRoute from './components/PrivateRoute';
import AdminPage from './pages/AdminPage';
import BuyerPage from './pages/BuyerPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/products"
        element={
          <PrivateRoute>
            <ProductPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/buyer"
        element={
          <PrivateRoute>
            <BuyerPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;