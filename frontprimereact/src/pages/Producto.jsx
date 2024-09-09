import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';
import axios from 'axios';

const Producto = () => {
    const [products, setProducts] = useState([]);
    const [productDialog, setProductDialog] = useState(false);
    const [product, setProduct] = useState({ id: null, name: '', category: null, type: null, supplier: null });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
   
    // Cargar productos, categorías, tipos y proveedores
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/v1/producto/')
            .then(response => setProducts(response.data));

        axios.get('http://127.0.0.1:8000/api/v1/categoria/')
            .then(response => setCategories(response.data));  // Cargar categorías

        axios.get('http://127.0.0.1:8000/api/v1/tipo_producto/')
            .then(response => setTypes(response.data));  // Cargar tipos

        axios.get('http://127.0.0.1:8000/api/v1/proveedores/')
            .then(response => setSuppliers(response.data));  // Cargar proveedores
    }, []);

    // Abrir diálogo para crear/modificar producto
    const openNew = () => {
        setProduct({ id: null, name: '', category: null, type: null, supplier: null });
        setProductDialog(true);
    };

    const hideDialog = () => {
        setProductDialog(false);
    };

    // Guardar producto en la base de datos (crear/modificar)
    const saveProduct = () => {
        if (product.id) {
            axios.put(`http://127.0.0.1:8000/api/v1/producto/${product.id}/`, product)
                .then(response => {
                    setProducts(products.map(p => (p.id === product.id ? response.data : p)));
                });
        } else {
            axios.post('http://127.0.0.1:8000/api/v1/producto/', product)
                .then(response => {
                    setProducts([...products, response.data]);
                });
        }
        setProductDialog(false);
    };

    // Borrar producto
    const deleteProduct = (productId) => {
        axios.delete(`http://127.0.0.1:8000/api/v1/producto/${productId}/`)
            .then(() => {
                setProducts(products.filter(p => p.id !== productId));
            });
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </React.Fragment>
    );
   console.log(selectedProduct)
    return (
        <div>
            <Toolbar className="mb-4" right={() => (
                <Button label="New Product" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
            )} />

            <DataTable value={products} selectionMode="single" onSelectionChange={(e) => setSelectedProduct(e.value)}>
                <Column field="name" header="Name"></Column>
                <Column field="category.name" header="Category"></Column>
                <Column field="type.name" header="Type"></Column>
                <Column field="supplier.name" header="Supplier"></Column>
                <Column body={(rowData) => (
                    <Button icon="pi pi-trash" className="p-button-danger" onClick={() => deleteProduct(rowData.id)} />
                )} />
            </DataTable>

            <Dialog visible={productDialog} style={{ width: '450px' }} header="Product Details" modal footer={productDialogFooter} onHide={hideDialog}>
                <div className="p-field">
                    <label htmlFor="name">Name</label>
                    <InputText id="name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
                </div>
                <div className="p-field">
                    <label htmlFor="category">Category</label>
                    <Dropdown  
                    value={selectedProduct} 
                    options={categories} 
                    placeholder="Select a Category"
                    itemTemplate={(nombre) => <div>{nombre.nombCategoria}</div>}
                    valueTemplate={(nombre) => {
                        if(nombre){
                            
                          
                            return <div>{nombre.nombCategoria}</div>
                      }
                      else{
                         return "Select a Category"
                      }
                   }}                                  
                    onChange={(e) => 
                     setSelectedProduct(e.value)}
                    optionLabel='title'                    
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="type">Type</label>
                    <Dropdown 
                    id="type" 
                    value={selectedProduct} 
                    options={types} 
                    itemTemplate={(nombre) => <div>{nombre.nombTipo}</div>}
                    valueTemplate={(nombre) => {
                        if(nombre){
                            return <div>{nombre.nombTipo}</div>
                        }else{
                            return <div>Select a Type</div>
                        }
                    }}
                    onChange={(e) =>  setSelectedProduct(e.value)}
                    optionLabel="title"  optionValue="id" placeholder="Select a Type" />
                </div>
                <div className="p-field">
                    <label htmlFor="supplier">Supplier</label>
                    <Dropdown id="supplier" 
                    value={selectedProduct} 
                    options={suppliers} 
                    itemTemplate={(option) => <div>{option.nombProveedor}</div>} 
                    valueTemplate={(option) =>{
                        if(option){
                            return <div>{option.nombProveedor}</div>
                        }else{
                            return <div>Select a Supplier</div>
                        }
                    } }
                    onChange={(e) => setSelectedProduct(e.value)} 
                    optionValue="id" optionLabel="title" placeholder="Select a Supplier" 
                    />
                </div>
            </Dialog>
        </div>
    );
};
export default Producto;
