import React, { useState, useEffect } from 'react';
import { api } from '../api';

function FormularioVenta() {
  const [formData, setFormData] = useState({
    estudiante_id: '',
    producto_id: '',
    cantidad: '',
    fecha: ''
  });

  const [estudiantes, setEstudiantes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [estudiantesRes, productosRes] = await Promise.all([
          api.get('/estudiantes'),
          api.get('/productos')
        ]);

        if (!Array.isArray(estudiantesRes.data) || !Array.isArray(productosRes.data)) {
          throw new Error('El servidor no devolvió listas válidas de estudiantes y productos.');
        }

        setEstudiantes(estudiantesRes.data);
        setProductos(productosRes.data);
        setError('');
      } catch (err) {
        console.error('Error al cargar estudiantes y productos:', err);
        setError('No se pudieron cargar estudiantes y productos. Verifica la conexión y la variable VITE_API_URL del backend.');
      }
    };

    cargarDatos();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/ventas', formData)
      .then(() => {
        setFormData({ estudiante_id: '', producto_id: '', cantidad: '', fecha: '' });
        window.location.reload();
      })
      .catch(err => {
        console.error('Error al registrar venta:', err);
        setError('No se pudo registrar la venta. Verifica la conexión con el backend e inténtalo de nuevo.');
      });
  };

  return (
    // Se añade un contenedor con style para forzar el 50% de pantalla
    <div style={{ maxWidth: '50vw', margin: '0 auto' }}>
      <div className="form-card-vertical">
        <div className="form-header">
          <span className="cyber-tag">SYSTEM // REGISTRY</span>
          <h2>NUEVA VENTA</h2>
        </div>

        {error && <p role="alert">{error}</p>}

        <form onSubmit={handleSubmit} className="form-vertical">
          <div className="input-group">
            <label>ESTUDIANTE</label>
            <select 
              name="estudiante_id" 
              value={formData.estudiante_id}
              onChange={handleChange} 
              required
            >
              <option value="">SELECCIONAR ESTUDIANTE</option>
              {estudiantes.map(e => (
                <option key={e.id} value={e.id}>
                  {e.nombre} - {e.grupo}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>PRODUCTO</label>
            <select 
              name="producto_id" 
              value={formData.producto_id}
              onChange={handleChange} 
              required
            >
              <option value="">SELECCIONAR PRODUCTO</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre} - ${p.precio}
                </option>
              ))}
            </select>
          </div>

          <div className="input-row" style={{ display: 'flex', gap: '10px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label>CANTIDAD</label>
              <input 
                type="number" 
                name="cantidad" 
                placeholder="0"
                min="1"
                value={formData.cantidad} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group" style={{ flex: 1 }}>
              <label>FECHA</label>
              <input 
                type="date" 
                name="fecha" 
                value={formData.fecha}
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-registrar-v">
            REGISTRAR VENTA ⚡
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormularioVenta;