import  { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';

const Inventario = () => {
    const [productos, setProductos] = useState([]);
    const [tiposProducto, setTiposProducto] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        unidad_medida: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        tipo_producto: { value: null, matchMode: FilterMatchMode.EQUALS },
        categoria: { value: null, matchMode: FilterMatchMode.EQUALS },
        stock: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const componentRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productosRes, tiposProductoRes, categoriasRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/v1/producto/'),
                    axios.get('http://127.0.0.1:8000/api/v1/tipo_producto/'),
                    axios.get('http://127.0.0.1:8000/api/v1/categoria/')
                ]);

                setProductos(productosRes.data);
                setTiposProducto(tiposProductoRes.data);
                setCategorias(categoriasRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const tipoProductoFilter = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={tiposProducto}
                onChange={(e) => options.filterCallback(e.value, options.index)}
                itemTemplate={(nombre) => <div>{nombre.nombTipo}</div>}
                optionLabel="nombre"
                placeholder="Seleccionar Tipo"
                className="p-column-filter"
            />
        );
    };

    const categoriaFilter = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={categorias}
                onChange={(e) => options.filterCallback(e.value, options.index)}
                itemTemplate={(nombre) => <div>{nombre.nombCategoria}</div>}
                optionLabel="nombre"
                placeholder="Seleccionar Categoría"
                className="p-column-filter"
            />
        );
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Inventario',
        copyStyles: false,
        print: async (printIframe) => {
            const document = printIframe.contentDocument;
            if (document) {
                const fecha = new Date().toLocaleString();
                const header = document.createElement('div');
                header.innerHTML = `<h2>Inventario - Fecha y Hora: ${fecha}</h2>`;
                document.body.insertBefore(header, document.body.firstChild);
            }
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (printIframe.contentWindow) {
                printIframe.contentWindow.print();
            }
        },
    });

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h1>Inventario</h1>
            <Button label="Imprimir Inventario" icon="pi pi-print" onClick={handlePrint} />
            <div ref={componentRef}>
                <DataTable 
                    value={productos} 
                    paginator 
                    rows={10} 
                    dataKey="idProducto" 
                    filters={filters} 
                    filterDisplay="row"
                    onFilter={(e) => setFilters(e.filters)}
                >
                    <Column 
                        field="nombProd" 
                        header="Nombre" 
                        filter 
                        filterPlaceholder="Buscar por nombre" 
                    />
                    <Column 
                        field="unidadProducto" 
                        header="Unidad de Medida" 
                        filter 
                        filterPlaceholder="Buscar por unidad" 
                    />
                    <Column 
                        field="idTipo_fk" 
                        header="Tipo de Producto" 
                        filter 
                        filterElement={tipoProductoFilter} 
                        showFilterMenu={false}
                    />
                    <Column 
                        field="idCategoria_fk" 
                        header="Categoría" 
                        filter 
                        filterElement={categoriaFilter} 
                        showFilterMenu={false}
                    />
                    <Column 
                        field="stock" 
                        header="Stock" 
                        filter 
                        filterPlaceholder="Buscar por stock" 
                    />
                </DataTable>
            </div>
        </div>
    );
};

export default Inventario;