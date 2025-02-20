// src/pages/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  // Estados para login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Estados para registro (modal)
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const navigate = useNavigate();

  // Función de login
  const handleLogin = async () => {
    try {
      const API_URL = 'https://magic-log-marketplace.onrender.com';
      //const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      const response = await axios.post(`${API_URL}/products`,{ email, password });
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      if (decoded.role === 'buyer') {
        navigate('/buyer');
      } else if (decoded.role === 'admin') {
        navigate('/admin/products');
      } else {
        navigate('/products');
      }
    } catch (err) {
      setLoginError('Correo o contraseña incorrectos');
    }
  };

  // Función de registro
  const handleRegister = async (e) => {
    e.preventDefault();
    // Validar que todos los campos estén completos
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim() || !registerConfirmPassword.trim()) {
      setRegisterError('Todos los campos son obligatorios.');
      return;
    }
    // Validar que la contraseña y su confirmación coincidan
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Las contraseñas no coinciden.');
      return;
    }
    setRegisterError('');
    try {

      //const response = await axios.post('http://localhost:3000/auth/register', {
        const API_URL = 'https://magic-log-marketplace.onrender.com';
        const response = await axios.post(`${API_URL}/auth/register`,{ 
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });
      setRegisterSuccess('Registro exitoso, por favor inicia sesión.');
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
      // Cierra el modal tras un breve lapso
      setTimeout(() => {
        setShowRegisterModal(false);
        setRegisterSuccess('');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setRegisterError(err.response.data.message);
      } else {
        setRegisterError('Error al registrar el usuario.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="text-center mb-4">Market-Place</h1>
          {loginError && <div className="alert alert-danger">{loginError}</div>}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prueba@prueba.com"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />
          </div>
          <button className="btn btn-primary w-100" onClick={handleLogin}>
            Login
          </button>
          <div className="text-center mt-3">
            <button className="btn btn-link" onClick={() => setShowRegisterModal(true)}>
              Registrarse
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Registar persona */}
      {showRegisterModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Registro</h5>
                <button type="button" className="btn-close" onClick={() => setShowRegisterModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label className="form-label">Nombre:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Correo:</label>
                    <input
                      type="email"
                      className="form-control"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contraseña:</label>
                    <input
                      type="password"
                      className="form-control"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirmar Contraseña:</label>
                    <input
                      type="password"
                      className="form-control"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    />
                  </div>
                  {registerError && <div className="alert alert-danger">{registerError}</div>}
                  {registerSuccess && <div className="alert alert-success">{registerSuccess}</div>}
                  <button type="submit" className="btn btn-primary w-100">
                    Registrar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

