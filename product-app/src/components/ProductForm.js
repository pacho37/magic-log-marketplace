// src/components/ProductForm.js
import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = ({ onSuccess }) => {
  const [formValues, setFormValues] = useState({
    name: '',
    sku: '',
    quantity: '',
    price: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const validate = () => {
    const errs = {};
    if (!formValues.name.trim()) {
      errs.name = "El nombre es obligatorio.";
    }
    if (!formValues.sku.trim()) {
      errs.sku = "El SKU es obligatorio.";
    }
    if (!formValues.quantity || isNaN(formValues.quantity) || Number(formValues.quantity) <= 0) {
      errs.quantity = "La cantidad debe ser un número positivo.";
    }
    if (!formValues.price || isNaN(formValues.price) || Number(formValues.price) <= 0) {
      errs.price = "El precio debe ser un número positivo.";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const API_URL = 'https://magic-log-marketplace.onrender.com';
      //await axios.post('http://localhost:3000/products', formValues, {
    
      await axios.post(`${API_URL}/products`, formValues, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("¡Producto creado exitosamente!");
      setFormValues({ name: '', sku: '', quantity: '', price: '' });
      setErrors({});
      // Llama al callback onSuccess para que el padre actualice la lista
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error al crear el producto:', err);
      setSuccess('');
      setErrors({ submit: "Error al crear el producto. Inténtalo de nuevo." });
    }
  };


  return (
    <div>
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre:</label>
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            className="form-control"
          />
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">SKU:</label>
          <input
            type="text"
            name="sku"
            value={formValues.sku}
            onChange={handleChange}
            className="form-control"
          />
          {errors.sku && <div className="text-danger">{errors.sku}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Cantidad:</label>
          <input
            type="number"
            name="quantity"
            value={formValues.quantity}
            onChange={handleChange}
            className="form-control"
          />
          {errors.quantity && <div className="text-danger">{errors.quantity}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Precio:</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formValues.price}
            onChange={handleChange}
            className="form-control"
          />
          {errors.price && <div className="text-danger">{errors.price}</div>}
        </div>
        {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
        <button type="submit" className="btn btn-primary w-100">
          Crear Producto
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
