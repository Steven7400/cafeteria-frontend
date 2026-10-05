import React, { useState, useEffect } from 'react';
import { api } from '../api';

function EditarVenta({ venta, onUpdate }) {
  const [formData, setFormData] = useState({
    estudiante_id: venta.estudiante_id,
    producto_id: venta.producto_id,
    cantidad: venta.cantidad,
    fecha: venta.fecha
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
    api.put(`/ventas/${venta.id}`, formData)
      .then(res => {
        alert(res.data.message);
        onUpdate();
      })
      .catch(err => {
        console.error('Error al actualizar venta:', err);
        setError('No se pudo actualizar la venta. Verifica la conexión con el backend e inténtalo de nuevo.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p role="alert">{error}</p>}
      <select name="estudiante_id" value={formData.estudiante_id}
        onChange={handleChange} required>
        {estudiantes.map(e => (
          <option key={e.id} value={e.id}>{e.nombre} - {e.grupo}</option>
        ))}
      </select>
      <select name="producto_id" value={formData.producto_id}
        onChange={handleChange} required>
        {productos.map(p => (
          <option key={p.id} value={p.id}>{p.nombre} - ${p.precio}</option>
        ))}
      </select>
      <input type="number" name="cantidad" value={formData.cantidad}
        onChange={handleChange} required />
      <input type="date" name="fecha" value={formData.fecha}
        onChange={handleChange} required />
      <button type="submit">Actualizar Venta</button>
    </form>
  );
}

export default EditarVenta;