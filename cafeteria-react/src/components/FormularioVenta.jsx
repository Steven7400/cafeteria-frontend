import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FormularioVenta() {
  const [formData, setFormData] = useState({
    estudiante_id: '',
    producto_id: '',
    cantidad: '',
    fecha: ''
  });

  const [estudiantes, setEstudiantes] = useState([]);
  const [productos, setProductos] = useState([]);


  useEffect(() => {
  const cargarDatos = async () => {
    try {
      const res = await axios.get(`${API_URL}/productos`);
      // Asegúrate de guardar solo si viene un arreglo
      setProductos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProductos([]); // <--- EVITA QUE SE ROMPA TU APP
    }
  };

  cargarDatos();
}, []);

  useEffect(() => {
    axios.get('http://localhost:3000/estudiantes')
      .then(res => setEstudiantes(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:3000/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/ventas', formData)
      .then(() => {
        setFormData({ estudiante_id: '', producto_id: '', cantidad: '', fecha: '' });
        window.location.reload();
      })
      .catch(err => console.error('Error al registrar venta:', err));
  };

  return (
    // Se añade un contenedor con style para forzar el 50% de pantalla
    <div style={{ maxWidth: '50vw', margin: '0 auto' }}>
      <div className="form-card-vertical">
        <div className="form-header">
          <span className="cyber-tag">SYSTEM // REGISTRY</span>
          <h2>NUEVA VENTA</h2>
        </div>

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