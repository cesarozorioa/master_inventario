import  { useState, useEffect, useRef } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import '../impresion.css';
import axios from 'axios';

const RepIngresos = () => {
    const [fechaInicial, setFechaInicial] = useState(null);
    const [fechaFinal, setFechaFinal] = useState(null);
    const [ingresos, setIngresos] = useState([]);
    const [productos, setProductos] = useState({});
    const [tiposProducto, setTiposProducto] = useState({});
    const toast = useRef(null);

    useEffect(() => {
        // Cargar productos y tipos de producto al montar el componente
        const fetchProductos = async () => {
            const responseProd = await axios.get('http://127.0.0.1:8000/api/v1/producto/');
            const responseTipoProd = await axios.get('http://127.0.0.1:8000/api/v1/tipo_producto/');
            
            const prodMap = {};
            const tipoProdMap = {};

            responseProd.data.forEach(prod => {
                prodMap[prod.idProducto] = prod;
            });

            responseTipoProd.data.forEach(tipo => {
                tipoProdMap[tipo.idTipo] = tipo.nombTipo;
            });

            setProductos(prodMap);
            setTiposProducto(tipoProdMap);
        };

        fetchProductos();
    }, []);

    const fetchIngresos = async () => {
        if (!fechaInicial || !fechaFinal) {           
            toast.current.show({severity: 'warn', summary: 'Advertencia', detail: 'Por favor, seleccione un rango de fechas'});
            return;
        }

        if (fechaInicial && fechaFinal) {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/ingreso/', {
                    params: {
                        fechaInicial: fechaInicial.toISOString().split('T')[0],
                        fechaFinal: fechaFinal.toISOString().split('T')[0]
                    }
                });
                const ingresosFiltrados = response.data.filter((ingreso) => {
                    const fechaIngreso = new Date(ingreso.fechaIngreso);
                    return fechaIngreso >= fechaInicial && fechaIngreso <= fechaFinal;
                });
                if (ingresosFiltrados.length === 0) {
                    toast.current.show({severity: 'warn', summary: 'Advertencia', detail: 'No se encontraron resultados'});
                }
                setIngresos(ingresosFiltrados);
            } catch (error) {
                console.error('Error fetching data', error);
                toast.current.show({severity: 'error', summary: 'Error', detail: 'Error al obtener datos. Por favor, intente de nuevo.'});
            }
        }
    };

    const agruparPorTipoProducto = () => {
        const grupos = {};
        ingresos.forEach((ingreso) => {
            const producto = productos[ingreso.idProd_fk];
            const tipoProducto = tiposProducto[producto.idTipo_fk];            

            if (!grupos[tipoProducto]) {
                grupos[tipoProducto] = [];
            }

            grupos[tipoProducto].push(ingreso);
        });

        return grupos;
    };

    const calcularSubtotalPorTipo = (ingresos) => {
        return ingresos.reduce((total, ingreso) => total + ingreso.cantIngreso, 0);
    };

    const calcularTotalGeneral = () => {
        return ingresos.reduce((total, ingreso) => total + ingreso.cantIngreso, 0);
    };

    const renderGroupedRows = () => {
        const grupos = agruparPorTipoProducto();
        const filas = [];

        Object.keys(grupos).forEach((tipoProducto) => {
            // Cabecera del grupo (tipo de producto)
            filas.push({
                isGroupHeader: true,
                tipoProducto,
                cantIngreso: null
            });

            // Filas de productos por tipo
            grupos[tipoProducto].forEach((ingreso) => {
                filas.push({
                    fechaIngreso: ingreso.fechaIngreso,
                    producto: productos[ingreso.idProd_fk]?.nombProd,
                    cantIngreso: ingreso.cantIngreso,
                    tipoProducto,
                    isGroupHeader: false
                });
            });

            // Subtotal por tipo de producto
            const subtotal = calcularSubtotalPorTipo(grupos[tipoProducto]);
            filas.push({
                isSubtotal: true,
                tipoProducto,
                subtotal,
                cantIngreso: subtotal
            });
        });

        return filas;
    };

    const rowClassName = (rowData) => {
        if (rowData.isGroupHeader) {
            return 'group-header';
        } else if (rowData.isSubtotal) {
            return 'subtotal-row';
        }
        return '';
    };

    const groupHeaderTemplate = (rowData) => {
        if (rowData.isGroupHeader) {
            return <tr><td colSpan="3"><strong>Tipo: {rowData.tipoProducto}</strong></td></tr>;
        }
        return null;
    };

    const subtotalTemplate = (rowData) => {
        if (rowData.isSubtotal) {
            return <tr><td colSpan="2"><strong>Subtotal {rowData.tipoProducto}:</strong></td><td><strong>{rowData.cantIngreso}</strong></td></tr>;
        }
        return null;
    };
    const imprimirReporte = () => {
        window.print();
    };

    return (
        <div className='p-4'>
            <Toast ref={toast} />
            <h2 className='text-2xl font-bold mb-4'>Reporte de Ingresos</h2>

            <div className="flex gap-4 mb-4">
                <div className="p-col-12 p-md-4">
                    <Calendar value={fechaInicial} onChange={(e) => setFechaInicial(e.value)} placeholder="Fecha Inicial" showIcon />
                </div>
                <div className="p-col-12 p-md-4">
                    <Calendar value={fechaFinal} onChange={(e) => setFechaFinal(e.value)} placeholder="Fecha Final" showIcon />
                </div>
                <div className="p-col-12 p-md-4">
                    <Button label="Generar Reporte" icon="pi pi-check" onClick={fetchIngresos} />
                </div>
            </div>

            <DataTable value={renderGroupedRows()} rowClassName={rowClassName}>
                <Column field="fechaIngreso" header="Fecha de Ingreso" />
                <Column field="producto" header="Producto" />
                <Column field="cantIngreso" header="Cantidad " />

                {/* Renderizar las filas de cabecera de grupo */}
                <Column body={groupHeaderTemplate} />

                {/* Renderizar las filas de subtotales */}
                <Column body={subtotalTemplate} />
            </DataTable>

            <div className="total-general">
                <strong>Total General: {calcularTotalGeneral()}</strong>
                {ingresos.length > 0 && (
                <Button label="Imprimir" icon="pi pi-print" onClick={imprimirReporte} className="p-button-warning mt-3 ml-8" />
            )}
            </div>
        </div>
    );
};

export default RepIngresos;
