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
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import axios from 'axios';

const Devolucion = () => {
    const [productos, setProductos] = useState([]);    
    const [devoluciones, setDevoluciones] = useState([]);    
    const [sucursales, setSucursales] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [selectedSucursal, setSelectedSucursal] = useState(null);
    const [cantidad, setCantidad] = useState(null);
    const [motivoDevolucion, setMotivoDevolucion] = useState(null);
    const [fechaDevolucion, setFechaDevolucion] = useState(new Date());
    const [modalVisible, setModalVisible] = useState(false);
    const [tipoFiltro, setTipoFiltro] = useState(null); // Materia Prima, Producto Terminado, Producto Final
    const [editingDevolucion, setEditingDevolucion] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tiposProducto, setTiposProducto] = useState([]);

    // Cargar productos y datos iniciales
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/v1/producto')
            .then(response => setProductos(response.data))
            .catch(error => console.log(error));

        axios.get('http://127.0.0.1:8000/api/v1/devolucion')
            .then(response => setDevoluciones(response.data))
            .catch(error => console.log(error));
            axios.get('http://127.0.0.1:8000/api/v1/tipo_producto/')
            .then(response => {
                setTiposProducto(response.data);  // Guardar los tipos de producto en el estado
            })
            .catch(error => {
                console.error('Error al obtener los tipos de producto:', error);
            });

        axios.get('http://127.0.0.1:8000/api/v1/sucursal/')
            .then(response => setSucursales(response.data))
            .catch(error => console.log(error));
        
    }, []);
   
   
    // Filtrar ingresos por tipo de producto
    const filtrarDevoluciones = () => {  
             console.log("filtrando por tipo de producto: ",tipoFiltro)   
        if (tipoFiltro) {
            return devoluciones.filter(devolucion => devolucion.productos === tipoFiltro);
        }
        return devoluciones;
    };
    const obtenerNombreProducto = (idProd_fk) => {
        const producto = productos.find((prod) => prod.idProducto === idProd_fk);
        return producto ? producto.nombProd : 'Desconocido';
      };

    const abrirModal = () => {
        setModalVisible(true);
        setSelectedProducto(null);
        setCantidad(null);
        setSelectedSucursal(null);        
        setMotivoDevolucion(null);        
        setFechaDevolucion(new Date());
    };

    const guardarDevolucion = () => {      
       
        const nuevoDevolucion = { idProd_fk: selectedProducto.idProducto, cantDevuelta:cantidad, idSuc_fk: selectedSucursal.idSucursal, fechaDevolucion: fechaDevolucion.toISOString().slice(0, 10), motivoDevolucion: motivoDevolucion };
        console.log("nueva devolucion: ", nuevoDevolucion);
        if(isEditing){
            axios.put(`http://127.0.0.1:8000/api/v1/devolucion/${editingDevolucion.idDevolucion}/`,nuevoDevolucion)
                .then(response => {
                    setDevoluciones(devoluciones.map(devolucion => {
                        if (devolucion.idDevolucion === editingDevolucion.idDevolucion) {
                            return response.data;
                        }
                        return devolucion;
                    }));
                    setModalVisible(false);
                   
                })
                .catch(error => {
                    console.error("Error en el servidor:", error.response.data);
                });
        }else{
            axios.post('http://127.0.0.1:8000/api/v1/devolucion/',nuevoDevolucion)
            .then(response => {
                setDevoluciones([...devoluciones, response.data]);
                setModalVisible(false);
            })
            .catch(error => {
                console.error("Error en el servidor:", error.response.data);
            });
        }
        setIsEditing(false);        
        
    };

    const editarDevolucion = (devolucion) => {
        console.log("row data a editar: ", devolucion);
        setIsEditing(true);
        productos.map(prod => {
            if (prod.nombProd == devolucion.idProd_fk) {
                setSelectedProducto(prod);
            }
        });
        setEditingDevolucion(devolucion);
        setModalVisible(true);
        console.log("producto seleccionado para editar: ", selectedProducto);
        setCantidad(devolucion.cantDevolucion);
        setFechaDevolucion(new Date(devolucion.fechaDevolucion));
    };
    const eliminarDevolucion = (devolucionId) => {
        
       
        axios.delete(`http://127.0.0.1:8000/api/v1/devolucion/${devolucionId}/`)
            .then(() => {
                setDevoluciones(devoluciones.filter(devolucion => devolucion.idDevolucion !== devolucionId));
            })
            .catch(error => {
                console.error("Error al eliminar el ingreso:", error.response.data);
            });
    };

    const accionPlantilla = (rowData) => (
        <React.Fragment>
            <Button label="Editar" onClick={() => editarDevolucion(rowData)} className="p-button-warning mr-2" icon="pi pi-pencil" />
            <Button label="Eliminar" onClick={() => eliminarDevolucion(rowData.idDevolucion)} className="p-button-danger mr-2" icon="pi pi-trash" />
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

                <Dropdown 
                options={sucursales}
                value={selectedSucursal}                
                itemTemplate={(nombre) => <div>{nombre.nombSucursal}</div>}
                valueTemplate={(nombre) => {
                    if(nombre){

                        return <div>{nombre.nombSucursal}</div>
                    }
                    else{
                        return <div>Seleccione Sucursal</div>
                    }
                }}
                onChange={(e) => 
                setSelectedSucursal(e.value)} 
                placeholder="Seleccione Sucursal" 
                optionLabel="nombre" />

            </div>
            <div className="p-field">
                <label htmlFor="cantidad">Cantidad</label>
                <InputNumber value={cantidad} onValueChange={(e) => setCantidad(e.value)} />
            </div>
            <div className="p-field">
                <label htmlFor="fechaIngreso">Fecha de Devolucion</label>
                <Calendar value={fechaDevolucion} onChange={(e) => setFechaDevolucion(e.value)} showIcon />
            </div>
            <div>
                <label htmlFor="motivo">Motivo de Devolucion</label>
                <InputText
                 id="motivoDevolucion"
                 name="motivoDevolucion"
                 value={motivoDevolucion || ""} 
                 className='uppercase w-full'
                 onChange={(e) => setMotivoDevolucion(e.target.value)}
                 />                 

            </div>
            <Button label="Guardar" onClick={guardarDevolucion} className="p-button-success mt-3 centered" icon="pi pi-check" />
        </Dialog>
    );

    // Templates para el Toolbar
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Nueva Devolucion" icon="pi pi-plus" onClick={abrirModal} />
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

            <DataTable value={filtrarDevoluciones()}>                
                <Column field="idProd_fk" header="Producto" body={(rowData) => obtenerNombreProducto(rowData.idProd_fk)} />           
                <Column field="cantDevuelta" header="Cantidad" />
                <Column field="fechaDevolucion" header="Fecha de Ingreso" />
                <Column field="motivoDevolucion" header="Motivo" />
                <Column field="idSuc_fk" header="Sucursal" />
                <Column body={accionPlantilla} header="Acciones" />
            </DataTable>

            {renderModal()}
        </div>
    );
}
export default Devolucion