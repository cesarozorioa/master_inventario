import  { useState, useEffect, useRef } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import '../impresion.css';
import axios from 'axios';

const RepPedidos = () => {
    const [sucursales, setSucursales] = useState([]);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
    const [fechaInicial, setFechaInicial] = useState(null);
    const [fechaFinal, setFechaFinal] = useState(null);
    const [pedidos, setPedidos] = useState([]);
    const [productos, setProductos] = useState({});
    const [detalles, setDetalles] = useState({});
    const toast = useRef(null);

    // Cargar sucursales desde la API
    useEffect(() => {
        const fetchSucursales = async () => {
            const response = await axios.get('http://127.0.0.1:8000/api/v1/sucursal/');
            setSucursales(response.data);
        };

        fetchSucursales();
    }, []);

    // Cargar productos y detalles cuando los pedidos cambian
    useEffect(() => {
        if (pedidos.length > 0) {
            const fetchDetallesYProductos = async () => {
                const responseDetalles = await axios.get('http://127.0.0.1:8000/api/v1/detalle_pedido/');
                const responseProductos = await axios.get('http://127.0.0.1:8000/api/v1/producto/');

                const detallesMap = {};
                const productosMap = {};

                responseDetalles.data.forEach(detalle => {
                    if (!detallesMap[detalle.idPed_fk]) {
                        detallesMap[detalle.idPed_fk] = [];
                    }
                    detallesMap[detalle.idPed_fk].push(detalle);
                });

                responseProductos.data.forEach(producto => {
                    productosMap[producto.idProducto] = producto.nombProd;
                });

                setDetalles(detallesMap);
                setProductos(productosMap);
            };

            fetchDetallesYProductos();
        }
    }, [pedidos]);

    // Función para filtrar los pedidos
    const fetchPedidos = async () => {
        if (!sucursalSeleccionada || !fechaInicial || !fechaFinal) {
            toast.current.show({severity: 'warn', summary: 'Advertencia', detail: 'Por favor, seleccione un rango de fechas y una sucursal'});
            return;
        }
      
        if (fechaInicial && fechaFinal && sucursalSeleccionada) {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/pedido/');
                console.log("response.data:>>>>>xxx ", response.data)
                // Filtrar los pedidos obtenidos por sucursal seleccionada y rango de fechas
               const pedidosFiltrados = response.data.filter(pedido => {
                    const fechaPedido = new Date(pedido.fechaPedido);
                    return (
                        pedido.idSucursal_fk === sucursalSeleccionada.idSucursal &&
                        fechaPedido >= fechaInicial && fechaPedido <= fechaFinal
                    );
                });

                if (pedidosFiltrados.length === 0) {
                    toast.current.show({severity: 'warn', summary: 'Advertencia', detail: 'No se encontraron resultados'});
                }

                setPedidos(pedidosFiltrados);
                console.log("pedidos filtrados:>>>> ", pedidosFiltrados)
            } catch (error) {
                console.error('Error fetching pedidos:', error);
                toast.current.show({severity: 'error', summary: 'Error', detail: 'Error al obtener datos. Por favor, intente de nuevo.'});
            }
        }
    };

    // Mostrar el detalle de los productos para cada pedido
    const productosTemplate = (rowData) => {
        const detallesPedido = detalles[rowData.idPedido] || [];
        return (
            <ul>
                {detallesPedido.map((detalle, index) => (
                    <li key={index}>
                        {productos[detalle.idProd_fk]} (Cantidad: {detalle.cantidadPedido})
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className='gap-4'>
            <Toast ref={toast} />
            <h2>Reporte de Pedidos</h2>

            <div className="flex gap-4 mb-4">
                {/* Seleccionar sucursal */}
                <div className="p-col-12 p-md-4">
                    <Dropdown
                        value={sucursalSeleccionada}
                        options={sucursales}
                        onChange={(e) => setSucursalSeleccionada(e.value)}
                        optionLabel="nombSucursal"
                        placeholder="Seleccionar Sucursal"
                    />
                </div>

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
                    <Button label="Generar Reporte" icon="pi pi-check" onClick={fetchPedidos} />
                </div>
            </div>

            {/* Tabla de pedidos */}
            <DataTable value={pedidos}>
                <Column field="idPedido" header="ID Pedido" />
                <Column field="fechaPedido" header="Fecha Pedido" />
                <Column body={productosTemplate} header="Productos" />
            </DataTable>
            { pedidos.length > 0 && <Button label="Imprimir" icon="pi pi-print" 
            className="p-button-warning mt-3 "
            onClick={() => window.print()                
            } /> }
        </div>
    );
};

export default RepPedidos;
