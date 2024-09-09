import  { useState, useEffect,useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import axios from "axios";

const TipoPedido = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedido, setPedido] = useState({id: null, nombre: ""});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    obtenerTipoPedidos();
  }, []);
  const obtenerTipoPedidos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/tipo_pedido/");
      setPedidos(response.data);
      
    } catch (error) {
      console.error("Error al obtener Tipo de pedidos:", error);
      toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo cargar los tipos de pedidos" });
    }
    
  };

  const abrirDialogo = (editar = false, pedidoSeleccionado = { id: null, nombre: "" }) => {
    console.log(pedidoSeleccionado) 
    setIsEditing(editar); 
    /*setProducto({ ...producto, ...productoSeleccionado });*/
    setPedido(pedidoSeleccionado);    
    setDialogVisible(true);

  };
  const cerrarDialogo = () => {
    setPedido({ id: null, nombre: "" });
    setDialogVisible(false);
  };

  const guardarTipoPedido = async () => {
    const { idTipoPedido,nombre } = pedido; 
    console.log(idTipoPedido,"xxx",nombre) 
    
    if (isEditing) {
      
      try {
        await axios.put(`http://127.0.0.1:8000/api/v1/tipo_pedido/${idTipoPedido}/`,{ nombPedido:nombre});
        toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipo Pedido modificado correctamente" });
      } catch (error) {
        console.log(error)
        toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo modificar el producto" });
      }
    } else {
      try {
        await axios.post("http://127.0.0.1:8000/api/v1/tipo_pedido/", { nombPedido:nombre});        
        toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipo de pedido agregado correctamente" });
      } catch (error) {
        console.log(error)
        toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo agregar el tipo de pedido" });
      }
    }
    obtenerTipoPedidos();
    cerrarDialogo();
  };

  const eliminarTipoPedido = async (pedidoId) => {  
    console.log(pedidoId)
     
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/tipo_pedido/${pedidoId}/`);
      obtenerTipoPedidos();
      toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipo de pedido eliminado correctamente" });
    } catch (error) {
      console.log(error)
      toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo eliminar el Tipo de pedido" });
    }
  };
  const accionPlantilla = (rowData) => {    
    return (
      <div>
        <Button label="Editar" icon="pi pi-pencil" onClick={() => abrirDialogo(true, rowData)} className="p-button-warning p-mr-2" />
        <Button label="Eliminar" icon="pi pi-trash" onClick={() => eliminarTipoPedido(rowData.idTipoPedido)} className="p-button-danger" />
      </div>
    );
  };
  return (
    <div>
    <Toast ref={toast} />
    <div className="p-d-flex p-jc-end p-mb-3">
      <Button label="Agregar Tipo Pedido" icon="pi pi-plus" onClick={() => abrirDialogo(false)} className="p-button-success" />
    </div>
    <DataTable value={pedidos} paginator rows={10}>
      <Column field="idTipoPedido" header="ID"></Column>
      <Column field="nombPedido" header="Nombre"></Column>
      <Column body={accionPlantilla} header="Acciones"></Column>
    </DataTable>

    <Dialog
      visible={dialogVisible}
      header={isEditing ? "Modificar Tipo Pedido" : "Agregar Tipo Pedido"}
      modal
      style={{ width: "400px" }}
      onHide={cerrarDialogo}
    >
      <div className="p-field">
        <label htmlFor="nombre">Nombre</label>
        <InputText
          id="nombre"
          name="nombre"
          value={pedido.nombre || ""}
          onChange={(e) => setPedido({ ...pedido, nombre: e.target.value })}
          required
          autoFocus
          className="p-inputtext"
        />
      </div>
      <div className="p-d-flex p-jc-between p-mt-4">
        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={cerrarDialogo} />
        <Button label="Guardar" icon="pi pi-check" className="p-button-primary" onClick={guardarTipoPedido} />
      </div>
    </Dialog>
  </div>    
  )
}

export default TipoPedido