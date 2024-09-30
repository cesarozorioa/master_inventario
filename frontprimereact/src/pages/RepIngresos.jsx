import  { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';

const RepIngresos = () => {
    const [fechaInicial, setFechaInicial] = useState(null);
    const [fechaFinal, setFechaFinal] = useState(null);
    const [ingresos, setIngresos] = useState([]);
    const [productos, setProductos] = useState({});
    const [tiposProducto, setTiposProducto] = useState({});

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
        if (fechaInicial && fechaFinal) {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/ingreso/', {
                    params: {
                        fechaInicial: fechaInicial.toISOString().split('T')[0],
                        fechaFinal: fechaFinal.toISOString().split('T')[0]
                    }
                });
                setIngresos(response.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        }
    };
    console.log("ingresos:>>> ", ingresos);
    console.log("productos>>>: ", productos);
    console.log("tipos de producto>>>: ", tiposProducto);    
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
        <div>
            <h2>Reporte de Ingresos</h2>

            <div className="p-grid">
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

            <DataTable value={ingresos} footer={renderFooter()}>
                <Column field="fechaIngreso" header="Fecha de Ingreso" />
                <Column field="cantIngreso" header="Cantidad Ingresada" />
                <Column
                    field="idProd_fk"
                    header="Producto"
                    body={(rowData) => productos[rowData.idProd_fk]?.nombreProducto}
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
