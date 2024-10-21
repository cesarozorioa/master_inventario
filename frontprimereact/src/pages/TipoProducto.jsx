import  { useState, useEffect,useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import axios from "axios";
const TipoProducto = () => {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({id: null, nombre: ""});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useRef(null);

  // Obtener los tipos de productos desde la API
  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/tipo_producto/");
      setProductos(response.data);
      
    } catch (error) {
      console.error("Error al obtener productos:", error);
      toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo cargar los productos" });
    }
    
  };

  const abrirDialogo = (editar = false, productoSeleccionado = { id: null, nombre: "" }) => {
    console.log(productoSeleccionado) 
    setIsEditing(editar); 
    /*setProducto({ ...producto, ...productoSeleccionado });*/
    setProducto(productoSeleccionado);    
    setDialogVisible(true);

  };

  const cerrarDialogo = () => {
    setProducto({ id: null, nombre: "" });
    setDialogVisible(false);
  };

  const guardarProducto = async () => {
    const { idTipo,nombre } = producto;   
    
    if (isEditing) {
      
      try {
        await axios.put(`http://127.0.0.1:8000/api/v1/tipo_producto/${idTipo}/`,{ nombTipo:nombre});
        toast.current.show({ severity: "success", summary: "Éxito", detail: "Producto modificado correctamente" });
      } catch (error) {
        console.log(error)
        toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo modificar el producto" });
      }
    } else {
      try {
        await axios.post("http://127.0.0.1:8000/api/v1/tipo_producto/", { nombTipo:nombre});        
        toast.current.show({ severity: "success", summary: "Éxito", detail: "Producto agregado correctamente" });
      } catch (error) {
        console.log(error)
        toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo agregar el producto" });
      }
    }
    obtenerProductos();
    cerrarDialogo();
  };

  const eliminarProducto = async (productoId) => {    
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/tipo_producto/${productoId}/`);
      obtenerProductos();
      toast.current.show({ severity: "success", summary: "Éxito", detail: "Producto eliminado correctamente" });
    } catch (error) {
      console.log(error)
      toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo eliminar el producto" });
    }
  };

  const accionPlantilla = (rowData) => {    
    return (
      <div>
        <Button label="Editar" icon="pi pi-pencil" onClick={() => abrirDialogo(true, rowData)} className="p-button-warning mr-2" />
        <Button label="Eliminar" icon="pi pi-trash" onClick={() => eliminarProducto(rowData.idTipo)} className="p-button-danger mr-2" />
      </div>
    );
  };
  return (
    <div>
    <Toast ref={toast} />
    <div className="p-d-flex p-jc-end p-mb-3">
      <Button label="Agregar Tipo Producto" icon="pi pi-plus" onClick={() => abrirDialogo(false)} className="p-button-success" />
    </div>
    <DataTable value={productos} paginator rows={10}>
      <Column field="idTipo" header="ID"></Column>
      <Column field="nombTipo" header="Nombre"></Column>
      <Column body={accionPlantilla} header="Acciones"></Column>
    </DataTable>

    <Dialog
      visible={dialogVisible}
      header={isEditing ? "Modificar Producto" : "Agregar Producto"}
      modal
      style={{ width: "400px" }}
      onHide={cerrarDialogo}
      className="p-fluid"
    >
      <div className="p-field">
        <label htmlFor="nombre">Nombre</label>
        <InputText
          id="nombre"
          name="nombre"
          value={producto.nombre || producto.nombTipo ||""}
          onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
          required
          autoFocus
          className="p-inputtext uppercase"
          
        />
      </div>
      <div className="flex inline gap-3 mt-3">
        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={cerrarDialogo} />
        <Button label="Guardar" icon="pi pi-check" className="p-button-primary" onClick={guardarProducto} />
      </div>
    </Dialog>
  </div>
  )
}
export default TipoProducto