import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import axios from "axios";
/*idCategoria,nombCategoria*/

const Categoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState({ id: null, nombre: "" });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const obtenerCategorias = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/categoria/"
      );
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener Categorias:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo cargar las categorias",
      });
    }
  };

  const abrirDialogo = (
    editar = false,
    categoriaSeleccionado = { id: null, nombre: "" }
  ) => {
    console.log(categoriaSeleccionado);
    setIsEditing(editar);
    setCategoria(categoriaSeleccionado);
    setDialogVisible(true);
  };
  const cerrarDialogo = () => {
    setCategoria({ id: null, nombre: "" });
    setDialogVisible(false);
  };

  const guardarCategoria = async () => {
    const { idCategoria, nombre } = categoria;
    console.log(idCategoria, "xxx", nombre);

    if (isEditing) {
      try {
        await axios.put(
          `http://127.0.0.1:8000/api/v1/categoria/${idCategoria}/`,
          { nombCategoria: nombre }
        );
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Categoria modificado correctamente",
        });
      } catch (error) {
        console.log(error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo modificar Categoria",
        });
      }
    } else {
      try {
        await axios.post("http://127.0.0.1:8000/api/v1/categoria/", {
          nombCategoria: nombre,
        });
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Tipo de categoria agregado correctamente",
        });
      } catch (error) {
        console.log(error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo agregar el tipo de pedido",
        });
      }
    }
    obtenerCategorias();
    cerrarDialogo();
  };

  const eliminarCategoria = async (categoriaId) => {
    console.log(categoria);

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/v1/categoria/${categoriaId}/`
      );
      obtenerCategorias();
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Categoria eliminado correctamente",
      });
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar La categoria",
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
          className="p-button-warning mr-2"
        />
        <Button
          label="Eliminar"
          icon="pi pi-trash"
          onClick={() => eliminarCategoria(rowData.idCategoria)}
          className="p-button-danger mr-2"
        />
      </div>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="p-d-flex p-jc-end p-mb-3">
        <Button
          label="Agregar Categoria"
          icon="pi pi-plus"
          onClick={() => abrirDialogo(false)}
          className="p-button-success"
        />
      </div>
      <DataTable value={categorias} paginator rows={10}>
        <Column field="idCategoria" header="ID"></Column>
        <Column field="nombCategoria" header="Nombre"></Column>
        <Column body={accionPlantilla} header="Acciones"></Column>
      </DataTable>

      <Dialog
        visible={dialogVisible}
        header={isEditing ? "Modificar Categoria" : "Agregar Categoria"}
        modal
        style={{ width: "400px" }}
        onHide={cerrarDialogo}
        className="p-fluid"
      >
        <div className="flex justify-content-center flex-column gap-2 ">
          <div className="p-field gap-2  ">
            <label htmlFor="nombre">Nombre</label>
            <InputText
              id="nombre"
              name="nombre"
              value={categoria.nombre || categoria.nombCategoria || ""}
              onChange={(e) =>
                setCategoria({ ...categoria, nombre: e.target.value })
              }
              required
              autoFocus
              className="p-inputtext uppercase"
            />
          </div>
          <div className="flex gap-3 mt-3">
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
              onClick={guardarCategoria}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Categoria;
