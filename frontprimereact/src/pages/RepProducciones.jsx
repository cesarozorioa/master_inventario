import  { useState, useEffect, useRef } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import axios from 'axios';

const RepProducciones = () => {
    const [fechaInicial, setFechaInicial] = useState(null);
    const [fechaFinal, setFechaFinal] = useState(null);
    const [producciones, setProducciones] = useState([]);
    const [productos, setProductos] = useState({});
    const [detallesProduccion, setDetallesProduccion] = useState({});
    const toast = useRef(null);

    // Cargar productos desde la API
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/producto/');
                const productosMap = {};
                response.data.forEach(producto => {
                    productosMap[producto.idProducto] = producto.nombProd;
                });
               
                setProductos(productosMap);
            } catch (error) {
                console.error('Error fetching productos:', error);
            }
        };

        fetchProductos();
    }, []);

    // Cargar detalles de producción y producción cuando cambia el estado de producciones
    useEffect(() => {
        if (producciones.length > 0) {
            const fetchDetallesProduccion = async () => {
                try {
                    const response = await axios.get('http://127.0.0.1:8000/api/v1/detalle_produccion/');
                    const detallesMap = {};

                    response.data.forEach(detalle => {
                        if (!detallesMap[detalle.idProduccion_fk]) {
                            detallesMap[detalle.idProduccion_fk] = [];
                        }
                        detallesMap[detalle.idProduccion_fk].push(detalle);
                    });

                    setDetallesProduccion(detallesMap);
                } catch (error) {
                    console.error('Error fetching detalles de producción:', error);
                }
            };

            fetchDetallesProduccion();
        }
    }, [producciones]);

    // Función para filtrar las producciones según el rango de fechas
    const fetchProducciones = async () => {
        if (!fechaInicial || !fechaFinal) {           
            toast.current.show({severity: 'warn', summary: 'Advertencia', detail: 'Por favor, seleccione un rango de fechas'});
            return;
        }
        if (fechaInicial && fechaFinal) {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/produccion/', {
                    params: {
                        fechaInicial: fechaInicial.toISOString().split('T')[0],
                        fechaFinal: fechaFinal.toISOString().split('T')[0]
                    }
                });
                
                const produccionesFiltrados = response.data.filter((produccion) => {
                    const fechaProduccion = new Date(produccion.fechaProduccion);
                    return fechaProduccion >= fechaInicial && fechaProduccion <= fechaFinal;
                });

                if (produccionesFiltrados.length === 0) {
                    toast.current.show({severity: 'warn', summary: 'Advertencia', detail: 'No se encontraron Producciones'});
                }

                setProducciones(produccionesFiltrados);
            } catch (error) {
                console.error('Error fetching producciones:', error);
                toast.current.show({severity: 'error', summary: 'Error', detail: 'Error al obtener datos. Por favor, intente de nuevo.'});
            }
        }
    };

    // Mostrar el detalle de los productos usados para cada producción
    const productosUsadosTemplate = (rowData) => {
      console.log("rowData>>>>>",rowData)
      console.log("detallesProduccion>>>>>",detallesProduccion)
        const detalles = detallesProduccion[rowData.idProduccion] || [];
        return (
            <ul>
                {detalles.map((detalle, index) => (
                    <li key={index}>
                        {productos[detalle.idMateriaPrima_fk]} (Cantidad: {detalle.cantidadUsada})
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className='p-4'>
            <Toast ref={toast} />
            <h2>Reporte de Producciones</h2>

            <div className="flex gap-4 mb-4">
                {/* Seleccionar fecha inicial */}
                <div className="p-col-12 p-md-4">
                    <Calendar
                        value={fechaInicial}
                        onChange={(e) => setFechaInicial(e.value)}
                        placeholder="Fecha Inicial"
                        showIcon
                    />
                </div>

                {/* Seleccionar fecha final */}
                <div className="p-col-12 p-md-4">
                    <Calendar
                        value={fechaFinal}
                        onChange={(e) => setFechaFinal(e.value)}
                        placeholder="Fecha Final"
                        showIcon
                    />
                </div>

                {/* Botón para generar reporte */}
                <div className="p-col-12">
                    <Button label="Generar Reporte" icon="pi pi-check" onClick={fetchProducciones} />
                </div>
            </div>

            {/* Tabla de producciones */}
            <DataTable value={producciones}>
                <Column field="idProduccion" header="ID Producción" />
                <Column field="fechaProduccion" header="Fecha Producción" />
                <Column field="cantProduccion" header="Cant. Producción" />
                <Column body={(rowData) => productos[rowData.idProd_fk]} header="Producto Elaborado" />
                <Column body={productosUsadosTemplate} header="Productos Usados" />
            </DataTable>
            {producciones.length > 0 && (
                <Button label="Imprimir" icon="pi pi-download" onClick={window.print} className="p-button-success mt-4" />
            )}
        </div>
    );
};
export default RepProducciones;


