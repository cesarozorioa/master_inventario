import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import axios from 'axios';

const ProductoManager = () => {
  const [products, setProducts] = useState([]);
  const [productDialog, setProductDialog] = useState(false);
  const [product, setProduct] = useState({
    nombre: '',
    tipo_producto: null,
    categoria: null,
    proveedor: null,
    unidad_medida: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const toast = useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchProductTypes();
    fetchCategories();
    fetchSuppliers();
  }, []);

  const obtenerNombreTipoProducto = (idTipo_fk) => {    
    
    const tipoProducto = productTypes.find((tprod) => tprod.value === idTipo_fk); 
    
    return tipoProducto ? tipoProducto.label : 'Desconocido';
  };

  const obtenerNombreCategorias = (idCategoria_fk) => {    
    const categoriaProducto = categories.find((tcategoria) => tcategoria.value === idCategoria_fk);  
    return categoriaProducto ? categoriaProducto.label : 'Desconocido';
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/v1/producto/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchProductTypes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/v1/tipo_producto/');
      setProductTypes(response.data.map(type => ({ value: type.idTipo, label: type.nombTipo })));
    } catch (error) {
      console.error('Error fetching product types:', error);
    }
  };
  

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/v1/categoria/');
      setCategories(response.data.map(category => ({ value: category.idCategoria, label: category.nombCategoria })));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/v1/proveedores/');
      setSuppliers(response.data.map(supplier => ({ value: supplier.idProveedor, label: supplier.nombProveedor })));
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const openNew = () => {
    setProduct({
      nombre: '',
      tipo_producto: null,
      categoria: null,
      proveedor: null,
      unidad_medida: ''
    });
    setSubmitted(false);
    setProductDialog(true);
    setEditMode(false);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const saveProduct = async () => {
    setSubmitted(true);
    
    const nuevoProducto = {
      nombProd: product.nombre,
      idTipo_fk: product.tipo_producto,
      idCategoria_fk: product.categoria,
      idProveedor_fk: product.proveedor,
      unidadProducto: product.unidad_medida
    }
    if (product.nombre.trim() && product.unidad_medida.trim()) {
      try {
        if (editMode) {
          await axios.put(`http://127.0.0.1:8000/api/v1/producto/${product.id}/`, nuevoProducto);
          toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado', life: 3000 });
        } else {
          await axios.post('http://127.0.0.1:8000/api/v1/producto/', nuevoProducto);
          toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto creado', life: 3000 });
        }
        fetchProducts();
        setProductDialog(false);
        setProduct({          
          nombre: '',
          tipo_producto: null,
          categoria: null,
          proveedor: null,
          unidad_medida: ''
        });
      } catch (error) {
        console.error('Error saving product:', error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el producto', life: 3000 });
      }
    }
  };

  const editProduct = (product) => {    
    let tipo,cat,prov;
    const { idTipo_fk: d1, idCategoria_fk: d2, idProveedor_fk: d3} = product;
    productTypes.map((type) => {
      if (type.label === d1) {        
        tipo = type.value;
      }
    }) 

    categories.map((category) => {
      if (category.label === d2) {
        cat = category.value;
      }
    })

    suppliers.map((supplier) => {
      if (supplier.label === d3) {
        prov = supplier.value;
      }
    })
    
    setProduct({
      id: product.idProducto,
      nombre: product.nombProd,
      tipo_producto: tipo,       
      categoria: cat,
      proveedor: prov,
      unidad_medida: product.unidadProducto
    })   
   
    setProductDialog(true);
    setEditMode(true);
  };

  const deleteProduct = async (product) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/producto/${product.idProducto}/`);
      fetchProducts();
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado', life: 3000 });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el producto', life: 3000 });
    }
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };
    _product[name] = val;
    setProduct(_product);
  };

  const onDropdownChange = (e, name) => {
    let _product = { ...product };
    _product[name] = e.value;
    setProduct(_product);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteProduct(rowData)} />
      </React.Fragment>
    );
  };

  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
    </React.Fragment>
  );
  

  return (
    <div>
      <Toast ref={toast} />

      <div className="card">
        <h5>Gestión de Productos</h5>
        <Button label="Nuevo Producto" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />

        <DataTable value={products} responsiveLayout="scroll">
          <Column field="nombProd" header="Nombre"></Column>          
          <Column field="idTipo_fk" header="Tipo de Producto" 
          body={(rowData) => obtenerNombreTipoProducto(rowData.idTipo_fk)}
          ></Column>
          <Column field="idCategoria_fk" header="Categoría"
          body={(rowData) => obtenerNombreCategorias(rowData.idCategoria_fk)}
          ></Column>
          <Column field="idProveedor_fk" header="Proveedor"></Column>
          <Column field="unidadProducto" header="Unidad de Medida"></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={productDialog} style={{ width: '450px' }} header="Detalles del Producto" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <InputText id="nombre" value={product.nombre || ''} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nombre })} />
          {submitted && !product.nombre && <small className="p-error">El nombre es requerido.</small>}
        </div>
        <div className="field">
          <label htmlFor="tipo_producto">Tipo de Producto</label>
          <Dropdown id="tipo_producto" value={product.tipo_producto}          
          options={productTypes}        
          optionLabel='label'
          onChange={(e) => onDropdownChange(e, 'tipo_producto')} placeholder="Seleccione un tipo de producto"
           />
        </div>
        <div className="field">
          <label htmlFor="categoria">Categoría</label>
          <Dropdown id="categoria" value={product.categoria || product.label || ''} 
          options={categories}          
          optionLabel='label'
          onChange={(e) => onDropdownChange(e, 'categoria')} placeholder="Seleccione una categoría" />
        </div>
        <div className="field">
          <label htmlFor="proveedor">Proveedor</label>
          <Dropdown id="proveedor" value={product.proveedor} options={suppliers} onChange={(e) => onDropdownChange(e, 'proveedor')} placeholder="Seleccione un proveedor" />
        </div>
        <div className="field">
          <label htmlFor="unidad_medida">Unidad de Medida</label>
          <InputText id="unidad_medida" value={product.unidad_medida} onChange={(e) => onInputChange(e, 'unidad_medida')} required className={classNames({ 'p-invalid': submitted && !product.unidad_medida })} />
          {submitted && !product.unidad_medida && <small className="p-error">La unidad de medida es requerida.</small>}
        </div>
      </Dialog>
    </div>
  );
}
export default ProductoManager