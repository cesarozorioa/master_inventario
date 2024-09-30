import   { useState, useEffect, useRef } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {Toast} from 'primereact/toast';
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
            alert('Por favor, seleccione un rango de fechas');
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
                //Filtrar los ingresos que estan en el rango de fechas
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
     
    const calcularTotalesPorCategoria = () => {
        const totalesPorCategoria = {};

        ingresos.forEach(ingreso => {
            const producto = productos[ingreso.idProd_fk];
            const tipoProducto = tiposProducto[producto.idTipo_fk];            
            if (!totalesPorCategoria[tipoProducto]) {
                totalesPorCategoria[tipoProducto] = 0;
            }
            
            totalesPorCategoria[tipoProducto] += ingreso.cantIngreso;
        });

        return totalesPorCategoria;
    };

    const renderFooter = () => {
        const totales = calcularTotalesPorCategoria();

        return (
            <tfoot>
                {Object.keys(totales).map((tipo, index) => (
                    <tr key={index}>
                        <td colSpan="3">Total {tipo}:</td>
                        <td>{totales[tipo]}</td>
                    </tr>
                ))}
            </tfoot>
        );
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
                    <Button label="Generar Reporte" icon="pi pi-print" onClick={fetchIngresos} />
                </div>
            </div>
            <DataTable value={ingresos} footer={renderFooter()} >
                <Column field="fechaIngreso" header="Fecha de Ingreso" />
                <Column field="cantIngreso" header="Cantidad Ingresada" />
                <Column
                    field="idProd_fk"
                    header="Producto"
                    body={(rowData) => productos[rowData.idProd_fk]?.nombProd}
                />
                <Column
                    field="idProd_fk"
                    header="Tipo de Producto"
                    body={(rowData) => tiposProducto[productos[rowData.idProd_fk]?.idTipo_fk]}
                />
            </DataTable>
        </div>
    );
};

export default RepIngresos;
