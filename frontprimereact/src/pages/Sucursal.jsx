import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import axios from "axios";

const Sucursal = () => {
  const [sucursales, setSucursales] = useState([]);
  const [sucursal, setSucursal] = useState({ id: null, nombre: "", telef: "" });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    obtenerSucursales();
  }, []);

  const obtenerSucursales = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/sucursal/"
      );
      setSucursales(response.data);
    } catch (error) {
      console.error("Error al obtener Sucursales:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo cargar las sucursales",
      });
    }
  };

  const abrirDialogo = (
    editar = false,
    sucursalSeleccionado = { id: null, nombre: "", telef: "" }
  ) => {
    setIsEditing(editar);
    /*setProducto({ ...producto, ...productoSeleccionado });*/
    setSucursal(sucursalSeleccionado);
    setDialogVisible(true);
  };

  const cerrarDialogo = () => {
    setSucursal({ id: null, nombre: "", telef: "" });
    setDialogVisible(false);
  };

  const guardarSucursal = async () => {
    const { idSucursal, nombre, telef } = sucursal;
    console.log(sucursal);
    console.log("idSucursal", idSucursal);

    if (isEditing) {
      try {
        await axios.put(
          `http://127.0.0.1:8000/api/v1/sucursal/${idSucursal}/`,
          { nombSucursal: nombre, telefSucursal: telef }
        );
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Sucursal modificado correctamente",
        });
      } catch (error) {
        console.log(error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo modificar Sucursal",
        });
      }
    } else {
      console.log("sucursal", sucursal);

      try {
        await axios.post("http://127.0.0.1:8000/api/v1/sucursal/", {
          nombSucursal: sucursal.nombre,
          telefSucursal: sucursal.telef,
        });
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Sucursal agregado correctamente",
        });
      } catch (error) {
        console.log(error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo agregar Sucursal",
        });
      }
    }
    obtenerSucursales();
    cerrarDialogo();
  };

  const eliminarSucursal = async (sucursalId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/v1/sucursal/${sucursalId}/`
      );
      obtenerSucursales();
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Sucursal eliminado correctamente",
      });
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar Sucursal",
      });
    }
  };

  const accionPlantilla = (rowData) => {
    return (
      <div>
        <Button
          label="Editar"
          icon="pi pi-pencil"
          onClick={() => abrirDialogo(true, rowData)}
          className="p-button-warning p-mr-2"
        />
        <Button
          label="Eliminar"
          icon="pi pi-trash"
          onClick={() => eliminarSucursal(rowData.idSucursal)}
          className="p-button-danger"
        />
      </div>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="p-d-flex p-jc-end p-mb-3">
        <Button
          label="Agregar Sucursal"
          icon="pi pi-plus"
          onClick={() => abrirDialogo(false)}
          className="p-button-success"
        />
      </div>
      <DataTable value={sucursales} paginator rows={10}>
        <Column field="idSucursal" header="ID"></Column>
        <Column field="nombSucursal" header="Nombre"></Column>
        <Column field="telefSucursal" header="Telef"></Column>
        <Column body={accionPlantilla} header="Acciones"></Column>
      </DataTable>

      <Dialog
        visible={dialogVisible}
        header={isEditing ? "Modificar Sucursalr" : "Agregar Sucursal"}
        modal
        style={{ width: "400px" }}
        onHide={cerrarDialogo}
        className="p-fluid"
      >
        <div className="flex justify-content-center flex-column gap-2 gap-4">
          <div className="p-field">
            <label htmlFor="nombre">Nombre</label>
            <InputText
              id="nombre"
              name="nombre"
              value={sucursal.nombre || sucursal.nombSucursal || ""}
              onChange={(e) =>
                setSucursal({ ...sucursal, nombre: e.target.value })
              }
              required
              autoFocus
              className="p-inputtext"
            />
          </div>
          <div className="p-field">
            <label htmlFor="telef">Telefono</label>
            <InputText
              id="telef"
              name="telef"
              value={sucursal.telef || ""}
              onChange={(e) =>
                setSucursal({ ...sucursal, telef: e.target.value })
              }
              required
              autoFocus
              className="p-inputtext uppercase"
            />
          </div>
        </div>
        <div className="flex inline gap-2 gap-4 mt-3">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-secondary"
            onClick={cerrarDialogo}
          />
          <Button
            label="Guardar"
            icon="pi pi-check"
            className="p-button-primary"
            onClick={guardarSucursal}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Sucursal;
