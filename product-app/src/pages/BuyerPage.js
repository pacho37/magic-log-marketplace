// src/pages/BuyerPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BuyerPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Estados para los filtros
  const [nameFilter, setNameFilter] = useState('');
  const [skuFilter, setSkuFilter] = useState('');
  const [minPriceFilter, setMinPriceFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchProducts = async (filters) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      let queryParams = [];
      if (filters.name) queryParams.push(`name=${encodeURIComponent(filters.name)}`);
      if (filters.sku) queryParams.push(`sku=${encodeURIComponent(filters.sku)}`);
      if (filters.minPrice !== undefined) queryParams.push(`minPrice=${filters.minPrice}`);
      if (filters.maxPrice !== undefined) queryParams.push(`maxPrice=${filters.maxPrice}`);
      const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
      const response = await axios.get(`http://localhost:3000/products/search${queryString}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProducts(response.data);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError('Error al obtener los productos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts({});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts({
      name: nameFilter,
      sku: skuFilter,
      minPrice: minPriceFilter,
      maxPrice: maxPriceFilter,
    });
  };

  // Función para limpiar los filtros y recargar la lista original
  const handleClearFilters = () => {
    setNameFilter('');
    setSkuFilter('');
    setMinPriceFilter('');
    setMaxPriceFilter('');
    fetchProducts({}); // Llama sin filtros
  };

  // Paginación
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Buscar Productos Comprador</h1>
      <button className="btn btn-danger mb-4" onClick={handleLogout}>
        Cerrar Sesión
      </button>
      
      <form onSubmit={handleSearch} className="border p-3 mb-4 rounded">
        <div className="row g-3">
          <div className="col-md-3">
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Buscar por nombre"
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="sku" className="form-label">SKU</label>
            <input
              type="text"
              id="sku"
              className="form-control"
              value={skuFilter}
              onChange={(e) => setSkuFilter(e.target.value)}
              placeholder="Buscar por SKU"
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="minPrice" className="form-label">Precio Mínimo</label>
            <input
              type="number"
              id="minPrice"
              className="form-control"
              value={minPriceFilter}
              onChange={(e) => setMinPriceFilter(e.target.value)}
              placeholder="Precio mínimo"
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="maxPrice" className="form-label">Precio Máximo</label>
            <input
              type="number"
              id="maxPrice"
              className="form-control"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(e.target.value)}
              placeholder="Precio máximo"
            />
          </div>
        </div>
        <div className="d-flex justify-content-center mt-3">
          <button type="submit" className="btn btn-primary me-2">Buscar</button>
          <button type="button" className="btn btn-secondary" onClick={handleClearFilters}>
            Limpiar Búsqueda
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center">No se encontraron productos.</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>SKU</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Vendedor</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.quantity}</td>
                    <td>${product.price}</td>
                    <td>{product.seller ? product.seller.name : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={handlePrev}>Anterior</button>
                </li>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((number) => (
                  <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(number)}>{number}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={handleNext}>Siguiente</button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default BuyerPage;
