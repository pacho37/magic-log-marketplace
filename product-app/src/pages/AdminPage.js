// src/pages/AdminPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [sellerId, setSellerId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Func para obtener productos
    const fetchProducts = async (sellerIdFilter) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const API_URL = 'https://magic-log-marketplace.onrender.com';
            const url = sellerIdFilter
                //? `http://localhost:3000/admin/products?sellerId=${sellerIdFilter}`
                //: `http://localhost:3000/admin/products`;
                ? `${API_URL}/admin/products?sellerId=${sellerIdFilter}`
                : `${API_URL}/admin/products`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Error al obtener los productos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(sellerId);
    }, [sellerId]);

    const handleSellerIdChange = (e) => {
        setSellerId(e.target.value);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Listado Productos (Admin)</h1>
            <button className="btn btn-danger" onClick={handleLogout}>
                Cerrar Sesión
            </button>

            <div className="mb-4">
                <label htmlFor="sellerId" className="form-label">Filtrar por ID de vendedor:</label>
                <input
                    type="text"
                    id="sellerId"
                    value={sellerId}
                    onChange={handleSellerIdChange}
                    placeholder="Ingrese el ID del vendedor"
                    className="form-control"
                />
            </div>

            {loading ? (
                <div className="text-center my-4">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger text-center">{error}</div>
            ) : products.length === 0 ? (
                <p className="text-center">No se encontraron productos.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Nombre Producto</th>
                                <th>SKU</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td><strong>{product.name}</strong></td>
                                    <td>{product.sku}</td>
                                    <td>{product.quantity}</td>
                                    <td>${product.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
