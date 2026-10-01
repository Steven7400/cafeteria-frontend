import React from 'react';
import ListaVentas from './components/ListaVentas';
import FormularioVenta from './components/FormularioVenta';
function App() {
return (
<div>
<h1>Cafetería Escolar</h1>
<FormularioVenta />
<ListaVentas />
</div>
);
}



export default App;