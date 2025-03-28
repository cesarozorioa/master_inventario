import React, { useState, useEffect } from "react";
import "../styles/IngresoProductos.css";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
/*import { Dropdown } from "primereact/dropdown";*/
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Toolbar } from "primereact/toolbar";
import { AutoComplete } from "primereact/autocomplete";
import axios from "axios";

const IngresoProductos = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [cantidad, setCantidad] = useState(null);
  const [fechaIngreso, setFechaIngreso] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState(null); // Materia Prima, Producto Terminado, Producto Final
  const [editingIngreso, setEditingIngreso] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tiposProducto, setTiposProducto] = useState([]);

  // Cargar productos y datos iniciales
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/v1/producto")
      .then((response) => setProductos(response.data))
      .catch((error) => console.log(error));

    axios
      .get("http://127.0.0.1:8000/api/v1/ingreso")
      .then((response) => setIngresos(response.data))
      .catch((error) => console.log(error));
    axios
      .get("http://127.0.0.1:8000/api/v1/tipo_producto/")
      .then((response) => {
        setTiposProducto(response.data); // Guardar los tipos de producto en el estado
      })
      .catch((error) => {
        console.error("Error al obtener los tipos de producto:", error);
      });
  }, []);

  // Filtrar ingresos por tipo de producto
  const filtrarIngresos = () => {
    console.log("filtrando por tipo de producto codigo: ", tipoFiltro);
    if (tipoFiltro) {
      // Filtrar los productos por el tipo seleccionado
      return ingresos.filter((ingreso) => {
        // Buscar el producto correspondiente al idProd_fk del ingreso
        const producto = productos.find(
          (producto) => producto.idProducto === ingreso.idProd_fk
        );

        // Verificar si el tipo del producto coincide con el tipoFiltro
        return producto && producto.idTipo_fk === tipoFiltro;
      });
    }

    // Si no hay filtro, devolver todos los ingresos
    return ingresos;
  };

  const obtenerNombreProducto = (idProd_fk) => {
    const producto = productos.find((prod) => prod.idProducto === idProd_fk);
    return producto ? producto.nombProd : "Desconocido";
  };
  const obtenerNombreTipo = (idProd_fk) => {
    const producto = productos.find((prod) => prod.idProducto === idProd_fk);
    if (!producto) return "Desconocido";
    const tipoProd = tiposProducto.find(
      (tp) => tp.idTipo === producto.idTipo_fk
    );
    return tipoProd ? tipoProd.nombTipo : "Desconocido";
  };
  const obtenerUnidadProducto = (idProd_fk) => {
    const producto = productos.find((prod) => prod.idProducto === idProd_fk);
    if (!producto) return "Desconocido";
    return producto ? producto.unidadProducto : "Desconocido";
  };
  const buscarProducto = (event) => {

    const query = event.query.toLowerCase();
    const resultados = productos.filter((producto) =>
      (producto.idTipo_fk === 4) || (producto.idTipo_fk === 6) &&
      producto.nombProd.toLowerCase().includes(query)
    );
    setFilteredProductos(resultados);
  };

  const abrirModal = () => {
    setModalVisible(true);
    setSelectedProducto(null);
    setCantidad(null);
    setFechaIngreso(new Date());
  };

  const guardarIngreso = () => {
    console.log("Ingreso selectedProducto: ", selectedProducto);

    const nuevoIngreso = {
      idProd_fk: parseInt(selectedProducto.idProducto),
      cantIngreso: cantidad,
      fechaIngreso: fechaIngreso.toISOString().slice(0, 10),
    };

    if (isEditing) {
      axios
        .put(
          `http://127.0.0.1:8000/api/v1/ingreso/${editingIngreso.idIngreso}/`,
          nuevoIngreso
        )
        .then((response) => {
          setIngresos(
            ingresos.map((ingreso) => {
              if (ingreso.idIngreso === editingIngreso.idIngreso) {
                return response.data;
              }
              return ingreso;
            })
          );
          setModalVisible(false);
        })
        .catch((error) => {
          console.error("Error en el servidor:", error.response.data);
        });
    } else {
      axios
        .post("http://127.0.0.1:8000/api/v1/ingreso/", nuevoIngreso)
        .then((response) => {
          setIngresos([...ingresos, response.data]);
          setModalVisible(false);
        })
        .catch((error) => {
          console.error("Error en el servidor:", error.response.data);
        });
    }

    setIsEditing(false);
  };

  const editarIngreso = (ingreso) => {
    console.log("row data a editar: ", ingreso);
    setIsEditing(true);
    productos.map((prod) => {
      if (prod.nombProd == ingreso.idProd_fk) {
        setSelectedProducto(prod);
      }
    });
    setEditingIngreso(ingreso);
    setModalVisible(true);
    setCantidad(ingreso.cantIngreso);
    setFechaIngreso(new Date(ingreso.fechaIngreso));
  };
  const eliminarIngreso = (ingresoId) => {
    const idIngreso = parseInt(ingresoId);
    console.log("idIngreso: >>>>>", idIngreso);
    axios
      .delete(`http://127.0.0.1:8000/api/v1/ingreso/${idIngreso}/`)
      .then(() => {
        setIngresos(
          ingresos.filter((ingreso) => ingreso.idIngreso !== ingresoId)
        );
      })
      .catch((error) => {
        console.error("Error al eliminar el ingreso:", error.response.data);
      });
  };

  const accionPlantilla = (rowData) => (
    <React.Fragment>
      <Button
        label="Editar"
        icon="pi pi-pencil"
        onClick={() => editarIngreso(rowData)}
        className="p-button-warning mr-2"
      />
      <Button
        label="Eliminar"
        icon="pi pi-trash"
        onClick={() => eliminarIngreso(rowData.idIngreso)}
        className="p-button-danger mr-2"
      />
    </React.Fragment>
  );

  const renderModal = () => (
    <Dialog
      visible={modalVisible}
      onHide={() => setModalVisible(false)}
      header="Ingresar Producto"
      className="p-fluid"
    >
      <div className="p-field">
        <label htmlFor="producto">Producto</label>
        <AutoComplete
          value={selectedProducto}
          suggestions={filteredProductos}
          completeMethod={buscarProducto}
          field="nombProd"
          onChange={(e) => setSelectedProducto(e.value)}
          placeholder="Seleccione Producto"
        />
      </div>
      {/*Unidad de Medida*/}
      {selectedProducto && (
        <div className="p-field">
          <label>Unidad de Medida: {selectedProducto.unidadProducto}</label>
        </div>
      )}
      {/*Unidad de Medida*/}

      <div className="p-field">
        <label htmlFor="cantidad">Cantidad</label>
        <InputNumber
          value={cantidad}
          onValueChange={(e) => setCantidad(e.value)}
        />
      </div>
      <div className="p-field">
        <label htmlFor="fechaIngreso">Fecha de Ingreso</label>
        <Calendar
          value={fechaIngreso}
          onChange={(e) => setFechaIngreso(e.value)}
          showIcon
        />
      </div>
      <Button
        label="Guardar"
        className="p-button-success mt-3 centered"
        onClick={guardarIngreso}
      />
    </Dialog>
  );

  // Templates para el Toolbar
  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label="Nuevo Ingreso" icon="pi pi-plus" onClick={abrirModal} />
      </React.Fragment>
    );
  };
  const rightToolbarTemplate = () => {
    return (
      <div style={{ display: "flex", alignItems: "right" }}>
        <div style={{ marginRight: "1rem" }}>
          <RadioButton
            value={null}
            name="tipoProducto"
            onChange={(e) => setTipoFiltro(e.value)}
            checked={tipoFiltro === null}
          />
          <label style={{ marginLeft: "0.5rem" }}>Todos</label>
        </div>

        {tiposProducto.map((tipo) => (
          <div key={tipo.idTipo} style={{ marginRight: "1rem" }}>
            <RadioButton
              value={tipo.idTipo}
              name="tipoProducto"
              onChange={(e) => setTipoFiltro(e.value)}
              checked={tipo.idTipo === tipoFiltro}
            />
            <label style={{ marginLeft: "0.5rem" }}>{tipo.nombTipo}</label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate} />

      <DataTable value={filtrarIngresos()} paginator rows={5}>
        <Column
          field="idProd_fk"
          header="Tipo"
          body={(rowData) => obtenerNombreTipo(rowData.idProd_fk)}
        />
        <Column
          field="idProd_fk"
          header="Producto"
          body={(rowData) => obtenerNombreProducto(rowData.idProd_fk)}
        />
        <Column field="cantIngreso" header="Cantidad" />
        <Column
          field="unidadProducto"
          header="Unidad"
          body={(rowData) => obtenerUnidadProducto(rowData.idProd_fk)}
        />
        <Column field="fechaIngreso" header="Fecha de Ingreso" />
        <Column body={accionPlantilla} header="Acciones" />
      </DataTable>

      {renderModal()}
    </div>
  );
};
export default IngresoProductos;
