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
        nombProd: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        unidad_medida: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        idTipo_fk: { value: null, matchMode: FilterMatchMode.EQUALS },
        idCategoria_fk: { value: null, matchMode: FilterMatchMode.EQUALS },
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

    const obtenerNombreTipo = (idTipo_fk) => {    
        const tiposP = tiposProducto.find((tprod) => tprod.idTipo === idTipo_fk);              
        return tiposP ? tiposP.nombTipo : 'Desconocido';
      };
    const obtenerNombreCategoria = (idCategoria_fk) => {
        
        const categoriasP = categorias.find((cat) => cat.idCategoria === idCategoria_fk);
        return categoriasP ? categoriasP.nombCategoria : 'Desconocida';
    }

    const tipoProductoFilterTemplate = (options) => {
        console.log("options>>>>: ", options);
        return (
            <Dropdown
                value={options.value}                
                options={tiposProducto}
                onChange={(e) => options.filterApplyCallback(e.value, options.index)}
                itemTemplate={(nombre) => <div>{nombre.nombTipo}</div>}
                valueTemplate={(nombre) => {
                    if(nombre){
        
                      return <div>{nombre.nombTipo}</div>
                  }
                  else{
                      return <div>Seleccione Tipo de Producto</div>
                  }}}
                filterBy="nombTipo"                 
                optionLabel="nombTipo"
                optionValue="idTipo"
                placeholder="Seleccionar Tipo"
                className="p-column-filter"
            />
        );
    };

    const categoriaFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={categorias}
                onChange={(e) => options.filterApplyCallback(e.value, options.index)}
                itemTemplate={(nombre) => <div>{nombre.nombCategoria}</div>}
                valueTemplate={(nombre) => {
                    if (nombre) {
                        return <div>{nombre.nombCategoria}</div>;
                    } else {
                        return <div>Seleccione Categoría</div>;
                    }
                }}
                filterBy="nombCategoria"
                optionLabel="nomCategoria"
                optionValue="idCategoria"
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
            <div className='flex justify-content-between align-items-center'>
            <h1>Inventario</h1>
            <Button label="Imprimir Inventario" icon="pi pi-print" onClick={handlePrint} />
            </div>
            
            <div ref={componentRef}>
                <DataTable 
                    value={productos} 
                    paginator 
                    rows={10} 
                    dataKey="idProducto" 
                    filters={filters} 
                    filterDisplay="menu"
                    onFilter={(e) => setFilters(e.filters)}
                    emptyMessage="No se encontraron productos."
                >
                    <Column 
                        field="nombProd" 
                        header="Nombre" 
                        filter 
                        filterPlaceholder="Buscar por nombre" 
                        showFilterMenu={true}
                    />
                    <Column 
                        field="unidadProducto" 
                        header="Unidad de Medida" 
                        filter 
                        filterPlaceholder="Buscar por unidad" 
                        showFilterMenu={false}
                    />
                    <Column 
                        field="idTipo_fk" 
                        body={(rowData) => obtenerNombreTipo(rowData.idTipo_fk)}
                        header="Tipo de Producto" 
                        filter                         
                        filterElement={tipoProductoFilterTemplate} 
                        showFilterMenu={true}
                        
                    />                    
                    <Column 
                        field="idCategoria_fk" 
                        body={(rowData) => obtenerNombreCategoria(rowData.idCategoria_fk)}
                        header="Categoría" 
                        filter 
                        filterElement={categoriaFilterTemplate} 
                        showFilterMenu={true}
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