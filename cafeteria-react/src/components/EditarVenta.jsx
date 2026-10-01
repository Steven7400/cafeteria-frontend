import React, { useState, useEffect } from 'react';
import axios from 'axios';
function EditarVenta({ venta, onUpdate }) {
const [formData, setFormData] = useState({
estudiante_id: venta.estudiante_id,
producto_id: venta.producto_id,
cantidad: venta.cantidad,
fecha: venta.fecha
});
const [estudiantes, setEstudiantes] = useState([]);
const [productos, setProductos] = useState([]);
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
axios.put(`http://localhost:3000/ventas/${venta.id}`, formData)
.then(res => {
alert(res.data.message);
onUpdate(); // refresca la lista de ventas
})
.catch(err => console.error('Error al actualizar venta:', err));
};
return (
<form onSubmit={handleSubmit}>
<select name="estudiante_id" value={formData.estudiante_id}
onChange={handleChange} required>
{estudiantes.map(e => (
<option key={e.id} value={e.id}>{e.nombre} - {e.grupo}</option>
))}
</select>
<select name="producto_id" value={formData.producto_id}
onChange={handleChange} required>
{productos.map(p => (
<option key={p.id} value={p.id}>{p.nombre} -
${p.precio}</option>
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