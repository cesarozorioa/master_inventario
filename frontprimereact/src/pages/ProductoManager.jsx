import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductoManager = () => {
  const [productos, setProductos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    tipoId: 0,
    categoriaId: 0,
    proveedorId: 0,
    unidadMedida: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Cargar productos, tipos, categorías y proveedores
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/v1/producto/')
      .then(response => setProductos(response.data))
      .catch(error => console.error(error));

    axios.get('http://127.0.0.1:8000/api/v1/tipo_producto/')
      .then(response => setTipos(response.data))
      .catch(error => console.error(error));

    axios.get('http://127.0.0.1:8000/api/v1/categoria/')
      .then(response => setCategorias(response.data))
      .catch(error => console.error(error));

    axios.get('http://127.0.0.1:8000/api/v1/proveedores/')
      .then(response => setProveedores(response.data))
      .catch(error => console.error(error));
  }, []);
console.log(productos)
  // Manejar cambio en los inputs del formulario
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const fetchProductos = () => {
    axios.get('http://127.0.0.1:8000/api/v1/producto/')
      .then(response => {
        setProductos(response.data); // Actualiza el estado con los productos más recientes
      })
      .catch(error => console.error('Error al obtener los productos:', error));
  };

  // Crear nuevo producto
  const handleCreate = () => {
    console.log('Datos a enviar:', form);
    const dataToSend = {
      nombProd: form.nombre,
      idTipo_fk: form.tipoId,
      idCategoria_fk: form.categoriaId,
      idProveedor_fk: form.proveedorId,
      unidadProducto: form.unidadMedida
    }
    
    axios.post('http://127.0.0.1:8000/api/v1/producto/',dataToSend)
      .then(response => {
        setProductos([...productos, response.data]);
        setForm({ nombre: '', tipoId: '', categoriaId: '', proveedorId: '', unidadMedida: '' });
        fetchProductos();
        //setIsEditing(false);
        console.log(response.data);
      })
      .catch(error => console.error(error));
  };

  // Editar producto
  const handleEdit = (product) => {

    setForm({
      nombre: product.nombProd,
      tipoId: product.idTipo_fk, // Convertir a entero el valor de product.idTipo_fk
      categoriaId: product.idCategoria_fk, // Convertir a entero el valor de product.idCategoria_fk,
      proveedorId: product.idProveedor_fk, // Convertir a entero el valor de product.idProveedor_fk,
      unidadMedida: product.unidadProducto
    });
    setIsEditing(true);
    setSelectedProductId(product.idProducto);
  };

  // Guardar cambios en el producto
  const handleUpdate = () => {    
    const dataToSend = {
      nombProd: form.nombre,
      idTipo_fk: form.tipoId,
      idCategoria_fk: form.categoriaId,
      idProveedor_fk: form.proveedorId,
      unidadProducto: form.unidadMedida
    }
    axios.put(`http://127.0.0.1:8000/api/v1/producto/${selectedProductId}/`, dataToSend)
      .then(response => {
        setProductos(productos.map(prod => (prod.idProducto === selectedProductId ? response.data : prod)));
        setForm({ nombre: '', tipoId: '', categoriaId: '', proveedorId: '', unidadMedida: '' });
        setIsEditing(false);
        setSelectedProductId(null);
      })
      .catch(error => console.error(error));
  };

  // Eliminar producto
  const handleDelete = (id) => {
    
    axios.delete(`http://127.0.0.1:8000/api/v1/producto/${id}/`)
      .then(() => {
        setProductos(productos.filter(product => product.idProducto !== id));
        
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>Gestión de Productos</h2>
      
      <form>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del Producto"
          value={form.nombre}
          onChange={handleChange}
        />

        <select name="tipoId" value={form.tipoId} onChange={handleChange}>
          <option value="">Seleccionar Tipo de Producto</option>
          {tipos.map(tipo => (
            <option key={tipo.idTipo} value={tipo.idTipo}>{tipo.nombTipo}</option>
          ))}
        </select>

        <select name="categoriaId" value={form.categoriaId} onChange={handleChange}>
          <option value="">Seleccionar Categoría</option>
          {categorias.map(categoria => (
            <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nombCategoria}</option>
          ))}
        </select>

        <select name="proveedorId" value={form.proveedorId} onChange={handleChange}>
          <option value="">Seleccionar Proveedor</option>
          {proveedores.map(proveedor => (
            <option key={proveedor.idProveedor} value={proveedor.idProveedor}>{proveedor.nombProveedor}</option>
          ))}
        </select>
        <input
          type="text"
          name="unidadMedida"
          placeholder="Unidad de Medida"
          value={form.unidadMedida}
          onChange={handleChange} 
        />

        <button type="button" onClick={isEditing ? handleUpdate : handleCreate}>
          {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
        
      </form>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th>Unidad de Medida</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(product => (
            <tr key={product.idProducto}>
              <td>{product.nombProd}</td>              
              <td>{tipos.find(tipo => tipo.idTipo === product.idTipo_fk)?.nombTipo}</td>
              <td>{categorias.find(categoria => categoria.idCategoria === product.idCategoria_fk)?.nombCategoria}</td>
              <td>{proveedores.find(proveedor => proveedor.idProveedor === product.idProveedor_fk)?.nombProveedor}</td>
              <td>{product.unidadProducto}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Editar</button>
                <button onClick={() => handleDelete(product.idProducto)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductoManager;
