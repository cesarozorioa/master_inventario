import  { useState, useEffect,useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import axios from "axios";

const Distribuidor = () => {
  const [distribuidores, setDistribuidores] = useState([]);
  const [distribuidor, setDistribuidor] = useState({id: null, nombre: "", telef:""});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    obtenerDistribuidores ();
  }, []);

  const obtenerDistribuidores = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/proveedores/");
      setDistribuidores(response.data);
      
    } catch (error) {
      console.error("Error al obtener Proveedores:", error);
      toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo cargar los proveedores" });
    }
    
  };

  const abrirDialogo = (editar = false, distribuidorSeleccionado = { id: null, nombre: "", telef:"" }) => {
    console.log(distribuidorSeleccionado) 
    setIsEditing(editar); 
    /*setProducto({ ...producto, ...productoSeleccionado });*/
    setDistribuidor(distribuidorSeleccionado);    
    setDialogVisible(true);

  };

  const cerrarDialogo = () => {
    setDistribuidor({ id: null, nombre: "", telef:""});
    setDialogVisible(false);
  };

  const guardarDistribuidor = async () => {
    const { idProveedor,nombre, telef } = distribuidor; 
    console.log(distribuidor)
    console.log("idProveedor",idProveedor)
    
    if (isEditing) {
      
      try {
        await axios.put(`http://127.0.0.1:8000/api/v1/proveedores/${idProveedor}/`,{ nombProveedor:nombre, telefProveedor:telef});
        toast.current.show({ severity: "success", summary: "Éxito", detail: "Proveedor modificado correctamente" });
      } catch (error) {
        console.log(error)
        toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo modificar Proveedor" });
      }
    } else {
      console.log("distribuidor",distribuidor)
      
      try {
        await axios.post("http://127.0.0.1:8000/api/v1/proveedores/", { nombProveedor:distribuidor.nombre, telefProveedor:distribuidor.telef});                
        toast.current.show({ severity: "success", summary: "Éxito", detail: "Proveedor agregado correctamente" });
      } catch (error) {
        console.log(error)
        toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo agregar el Proveedor" });
      }
    }
    obtenerDistribuidores();
    cerrarDialogo();
  }; 

  const eliminarDistribuidor = async (distribuidorId) => {  
        
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/proveedores/${distribuidorId}/`);
      obtenerDistribuidores();
      toast.current.show({ severity: "success", summary: "Éxito", detail: "Proveedor eliminado correctamente" });
    } catch (error) {
      console.log(error)
      toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo eliminar El Proveedor" });
    }
  };

  const accionPlantilla = (rowData) => {    
    return (
      <div>
        <Button label="Editar" icon="pi pi-pencil" onClick={() => abrirDialogo(true, rowData)} className="p-button-warning p-mr-2" />
        <Button label="Eliminar" icon="pi pi-trash" onClick={() => eliminarDistribuidor(rowData.idProveedor)} className="p-button-danger" />
      </div>
    );
  };

  return (
    <div>
    <Toast ref={toast} />
    <div className="p-d-flex p-jc-end p-mb-3">
      <Button label="Agregar Proveedor" icon="pi pi-plus" onClick={() => abrirDialogo(false)} className="p-button-success" />
    </div>
    <DataTable value={distribuidores} paginator rows={10}>
      <Column field="idProveedor" header="ID"></Column>
      <Column field="nombProveedor" header="Nombre"></Column>
      <Column field="telefProveedor" header="Telef"></Column>
      <Column body={accionPlantilla} header="Acciones"></Column>
    </DataTable>

    <Dialog
      visible={dialogVisible}
      header={isEditing ? "Modificar Proveedor" : "Agregar Proveedor"}
      modal
      style={{ width: "400px" }}
      onHide={cerrarDialogo}
    >
      <div className="p-field">
        <label htmlFor="nombre">Nombre</label>
        <InputText
          id="nombre"
          name="nombre"
          value={distribuidor.nombre || distribuidor.nombProveedor || ""}
          onChange={(e) => setDistribuidor({ ...distribuidor, nombre: e.target.value })}
          required
          autoFocus
          className="p-inputtext"
        />
      </div>
      <div className="p-field">
        <label htmlFor="telef">Telef</label>
        <InputText
          id="telef"
          name="telef"
          value={distribuidor.telef || distribuidor.telefProveedor || ""}
          onChange={(e) => setDistribuidor({ ...distribuidor, telef: e.target.value })}
          required
          autoFocus
          className="p-inputtext"
        />
      </div>
      <div className="p-d-flex p-jc-between p-mt-4">
        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={cerrarDialogo} />
        <Button label="Guardar" icon="pi pi-check" className="p-button-primary" onClick={guardarDistribuidor} />
      </div>
    </Dialog>
  </div>
  )
}

export default Distribuidor