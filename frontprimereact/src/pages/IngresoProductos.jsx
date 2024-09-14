import React, { useState, useEffect } from 'react';
import 'primeicons/primeicons.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Toolbar } from 'primereact/toolbar';
import axios from 'axios';

const IngresoProductos = () => {
    const [productos, setProductos] = useState([]);    
    const [ingresos, setIngresos] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [cantidad, setCantidad] = useState(null);
    const [fechaIngreso, setFechaIngreso] = useState(new Date());
    const [modalVisible, setModalVisible] = useState(false);
    const [tipoFiltro, setTipoFiltro] = useState(null); // Materia Prima, Producto Terminado, Producto Final
    const [editingIngreso, setEditingIngreso] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tiposProducto, setTiposProducto] = useState([]);

    // Cargar productos y datos iniciales
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/v1/producto')
            .then(response => setProductos(response.data))
            .catch(error => console.log(error));

        axios.get('http://127.0.0.1:8000/api/v1/ingreso')
            .then(response => setIngresos(response.data))
            .catch(error => console.log(error));
            axios.get('http://127.0.0.1:8000/api/v1/tipo_producto/')
            .then(response => {
                setTiposProducto(response.data);  // Guardar los tipos de producto en el estado
            })
            .catch(error => {
                console.error('Error al obtener los tipos de producto:', error);
            });
        
    }, []);
   
   
    // Filtrar ingresos por tipo de producto
    const filtrarIngresos = () => {  
             console.log("filtrando por tipo de producto: ",tipoFiltro)   
        if (tipoFiltro) {
            return ingresos.filter(ingreso => ingreso.productos === tipoFiltro);
        }
        return ingresos;
    };

    const abrirModal = () => {
        setModalVisible(true);
        setSelectedProducto(null);
        setCantidad(null);
        setFechaIngreso(new Date());
    };

    const guardarIngreso = () => {       
        

        const nuevoIngreso = { idProd_fk: selectedProducto.idProducto, cantIngreso:cantidad, fechaIngreso: fechaIngreso.toISOString().slice(0, 10) };
        
        if(isEditing){
            axios.put(`http://127.0.0.1:8000/api/v1/ingreso/${editingIngreso.idIngreso}/`, nuevoIngreso)
                .then(response => {
                    setIngresos(ingresos.map(ingreso => {
                        if (ingreso.idIngreso === editingIngreso.idIngreso) {
                            return response.data;
                        }
                        return ingreso;
                    }));
                    setModalVisible(false);
                   
                })
                .catch(error => {
                    console.error("Error en el servidor:", error.response.data);
                });
        }else{
            axios.post('http://127.0.0.1:8000/api/v1/ingreso/', nuevoIngreso)
            .then(response => {
                setIngresos([...ingresos, response.data]);
                setModalVisible(false);
            })
            .catch(error => {
                console.error("Error en el servidor:", error.response.data);
            });
        }
        setIsEditing(false);        
        
    };

    const editarIngreso = (ingreso) => {
        console.log("row data a editar: ", ingreso);
        setIsEditing(true);
        productos.map(prod => {
            if (prod.nombProd == ingreso.idProd_fk) {
                setSelectedProducto(prod);
            }
        });
        setEditingIngreso(ingreso);
        setModalVisible(true);        
        setCantidad(ingreso.cantIngreso);
        setFechaIngreso(new Date(ingreso.fechaIngreso));
    };
    const eliminarIngreso = (ingresoId) => {
        
       
        axios.delete(`http://127.0.0.1:8000/api/v1/ingreso/${ingresoId}/`)
            .then(() => {
                setIngresos(ingresos.filter(ingreso => ingreso.idIngreso !== ingresoId));
            })
            .catch(error => {
                console.error("Error al eliminar el ingreso:", error.response.data);
            });
    };

    const accionPlantilla = (rowData) => (
        <React.Fragment>
            <Button label="Editar" onClick={() => editarIngreso(rowData)} className="p-button-warning" />
            <Button label="Eliminar" onClick={() => eliminarIngreso(rowData.idIngreso)} className="p-button-danger" />
        </React.Fragment>
    );

    const renderModal = () => (
        <Dialog visible={modalVisible} onHide={() => setModalVisible(false)} header="Ingresar Producto">
            <div className="p-field">
                <label htmlFor="producto">Producto</label>
                <Dropdown 
                options={productos}
                value={selectedProducto}                
                itemTemplate={(nombre) => <div>{nombre.nombProd}</div>}
                valueTemplate={(nombre) => {
                    if(nombre){

                        return <div>{nombre.nombProd}</div>
                    }
                    else{
                        return <div>Seleccione Producto</div>
                    }
                }}
                onChange={(e) => 
                setSelectedProducto(e.value)} 
                placeholder="Seleccione Producto" 
                optionLabel="nombre" />
            </div>
            <div className="p-field">
                <label htmlFor="cantidad">Cantidad</label>
                <InputNumber value={cantidad} onValueChange={(e) => setCantidad(e.value)} />
            </div>
            <div className="p-field">
                <label htmlFor="fechaIngreso">Fecha de Ingreso</label>
                <Calendar value={fechaIngreso} onChange={(e) => setFechaIngreso(e.value)} showIcon />
            </div>
            <Button label="Guardar" onClick={guardarIngreso} />
        </Dialog>
    );

    // Templates para el Toolbar
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Nuevo Ingreso" icon="pi pi-plus" onClick={abrirModal} />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {   
           
        return (
            <div style={{ display: 'flex', alignItems: 'right' }}>
            {tiposProducto.map((tipo) => (
                <div key={tipo.idTipo} style={{ marginRight: '1rem' }}>
                    <RadioButton
                        value={tipo.nombTipo}
                        name="tipoProducto"
                        onChange={(e) => setTipoFiltro(e.value)}
                        checked={tipo.nombTipo === tipoFiltro}
                    />
                    <label style={{ marginLeft: '0.5rem' }}>{tipo.nombTipo}</label>
                </div>
            ))} 
        </div>

        );
    };
    
    return (
        <div>
            <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate} />

            <DataTable value={filtrarIngresos()}>                
                <Column field="idProd_fk" header="Producto" />           
                <Column field="cantIngreso" header="Cantidad" />
                <Column field="fechaIngreso" header="Fecha de Ingreso" />
                <Column body={accionPlantilla} header="Acciones" />
            </DataTable>

            {renderModal()}
        </div>
    );
};
export default IngresoProductos;