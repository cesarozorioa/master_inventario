import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import axios from "axios";

const Produccion = () => {
  const [productions, setProductions] = useState([]);
  const [productionDetails, setProductionDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [productionDialog, setProductionDialog] = useState(false);
  const [detailDialog, setDetailDialog] = useState(false);
  const [newProduction, setNewProduction] = useState({});
  const [newDetail, setNewDetail] = useState({});
  const toast = useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchProductions();
  }, []);

  const obtenerNombreProducto = (idProd_fk) => {
    const producto = products.find((prod) => prod.idProducto === idProd_fk);
    return producto ? producto.nombProd : "Desconocido";
  };
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/producto/"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchProductions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/produccion/"
      );
      setProductions(response.data);
    } catch (error) {
      console.error("Error fetching productions:", error);
    }
  };

  const fetchProductionDetails = async (productionId) => {
    console.log("productionId ????: ", productionId);
    console.log("newDetail: ", newDetail);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/detalle_produccion/?idProduccion_fk=${productionId}`
      );
      setProductionDetails(response.data);
    } catch (error) {
      console.error("Error fetching production details:", error);
    }
  };
  //console.log("productions Details:xxxxxx ", productionDetails);

  const saveProduction = async () => {
    const newProduction1 = {
      idProd_fk: newProduction.product.idProducto,
      fechaProduccion: newProduction.production_date,
      cantProduccion: newProduction.quantity,
    };

    try {
      if (selectedProduction) {
        await axios.put(
          `http://localhost:8000/api/v1/produccion/${selectedProduction.idProduccion}/`,
          newProduction1
        );
      } else {
        await axios.post(
          "http://localhost:8000/api/v1/produccion/",
          newProduction1
        );
      }
      fetchProductions();
      setProductionDialog(false);
      setNewProduction({});
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Production saved",
        life: 3000,
      });
    } catch (error) {
      console.error("Error saving production:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error saving production",
        life: 3000,
      });
    }
  };

  const saveProductionDetail = async () => {
    const newDetail1 = {
      //id:idDetalle,
      idProduccion_fk: selectedProduction.idProduccion,
      cantidadUsada: newDetail.quantity,
      idMateriaPrima_fk: newDetail.product.idProducto,
    };

    try {
      if (newDetail.id) {
        await axios.put(
          `http://127.0.0.1:8000/api/v1/detalle_produccion/${newDetail.id}/`,
          newDetail1
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Detalle Actualizado",
          life: 3000,
        });
      } else if (newDetail.product.stock >= newDetail.quantity) {
        await axios.post(
          "http://127.0.0.1:8000/api/v1/detalle_produccion/",
          newDetail1
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Production detail saved",
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No hay suficiente stock",
          life: 3000,
        });
      }
      fetchProductionDetails(selectedProduction.idProduccion);
      setDetailDialog(false);
      setNewDetail({});
    } catch (error) {
      console.error("Error al grabar el detalle:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al grabar el detalle",
        life: 3000,
      });
    }
  };

  const deleteProduction = async (production) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/produccion/${production.idProduccion}/`
      );
      fetchProductions();
      setSelectedProduction(null);
      setProductionDetails([]);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Produccion borrada",
        life: 3000,
      });
    } catch (error) {
      console.error("Error deleting production:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error no se puede borrar",
        life: 3000,
      });
    }
  };

  const deleteProductionDetail = async (detail) => {
    console.log("en delete el detalle: ", detail);
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/v1/detalle_produccion/${detail.idDetalleProduccion}/`
      );
      fetchProductionDetails(selectedProduction.idProduccion);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Production detail deleted",
        life: 3000,
      });
    } catch (error) {
      console.error("Error deleting production detail:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error deleting production detail",
        life: 3000,
      });
    }
  };

  const openNew = () => {
    setSelectedProduction(null);
    setNewProduction({
      production_date: new Date().toISOString().slice(0, 10),
    });
    setProductionDialog(true);
  };

  const openNewDetail = () => {
    setNewDetail({ production: selectedProduction.idProduccion });
    setDetailDialog(true);
  };

  const editProduction = (production) => {
    let pro;
    setSelectedProduction(production);
    const { idProd_fk: p } = production;
    console.log("p: ", p);
    products.map((prod) => {
      if (prod.nombProd == p) pro = prod.idProducto;
      console.log(pro);
    });

    setNewProduction({
      id: production.idProduccion,
      product: pro,
      quantity: production.cantProduccion,
      production_date: production.fechaProduccion,
    });
    //agregado
    fetchProductionDetails(production.idProduccion);
    setProductionDialog(true);
  };

  const editProductionDetail = (detail) => {
    setNewDetail({
      id: detail.idDetalleProduccion,
      production: detail.idProduccion_fk,
      product: detail.idMateriaPrima_fk,
      quantity: detail.cantidadUsada,
    });

    setDetailDialog(true);
  };
  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editProduction(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mr-2"
          onClick={() => deleteProduction(rowData)}
        />
        <Button
          icon="pi pi-list"
          className="p-button-rounded p-button-info mr-2"
          onClick={() => selectProduction(rowData)}
        />
      </>
    );
  };

  const detailActionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editProductionDetail(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => deleteProductionDetail(rowData)}
        />
      </>
    );
  };

  const selectProduction = (production) => {
    setSelectedProduction(production);
    fetchProductionDetails(production.idProduccion);
  };

  {
    /* cambio para mostrar la unidad de medida */
  }

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <h1>Producciónes Planta</h1>
        <Button
          label="Nueva Producción"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={openNew}
        />
        <DataTable
          value={productions}
          responsiveLayout="scroll"
          paginator
          rows={5}
        >
          <Column field="idProduccion" header="Nro Produccion"></Column>
          <Column
            field="idProd_fk"
            header="Producto"
            body={(rowData) => obtenerNombreProducto(rowData.idProd_fk)}
          />
          <Column field="fechaProduccion" header="Fecha Producción"></Column>
          <Column field="cantProduccion" header="Cantidad"></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={productionDialog}
        style={{ width: "450px" }}
        header="Producto"
        modal
        className="p-fluid"
        onHide={() => setProductionDialog(false)}
      >
        <div className="field">
          <label htmlFor="producto">Producto</label>
          <Dropdown
            id="producto"
            value={newProduction.product || newProduction.nombProd}
            onChange={(e) =>
              setNewProduction({
                ...newProduction,
                product: e.value,
                unidadProducto: e.value.unidadProducto,
              })
            }
            options={products}
            itemTemplate={(name) => <div>{name.nombProd}</div>}
            valueTemplate={(name) => {
              if (name) {
                return <div>{name.nombProd}</div>;
              } else {
                return <div>Seleccione Producto</div>;
              }
            }}
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccione Producto"
          />
        </div>
        <div className="field">
          <label htmlFor="production_date">Fecha-Produccion</label>
          <Calendar
            id="production_date"
            value={new Date(newProduction.production_date || "")}
            onChange={(e) =>
              setNewProduction({
                ...newProduction,
                production_date: e.value.toISOString().slice(0, 10),
              })
            }
            showIcon
          />
        </div>
        <div className="field">
          <label htmlFor="quantity">Cantidad</label>
          <InputNumber
            id="quantity"
            value={newProduction.quantity}
            onValueChange={(e) =>
              setNewProduction({ ...newProduction, quantity: e.value })
            }
          />
          {/*Unidad de Medida*/}

          {newProduction && newProduction.unidadProducto && (
            <div className="p-field">
              <label>Unidad de Medidas: {newProduction.unidadProducto}</label>
            </div>
          )}
          {/*Unidad de Medida*/}
        </div>

        <Button
          label="Grabar"
          icon="pi pi-check"
          className="p-button-success mt-3 centered"
          onClick={saveProduction}
        />
      </Dialog>

      {selectedProduction && (
        <div className="card mt-4">
          <h2>
            Productos usados en la Produccion #{selectedProduction.idProduccion}
          </h2>
          <Button
            label="Detalle Materia Prima"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={openNewDetail}
          />

          <DataTable
            value={productionDetails}
            showGridlines
            tableStyle={{ minWidth: "50rem" }}
            scrollable
            scrollHeight="400px"
          >
            <Column field="idProduccion_fk" header="No Produccion"></Column>
            <Column
              field="idMateriaPrima_fk"
              header="Materia Prima Usada"
              body={(rowData) =>
                obtenerNombreProducto(rowData.idMateriaPrima_fk)
              }
            />
            <Column field="cantidadUsada" header="Cantidad"></Column>
            <Column
              body={detailActionBodyTemplate}
              exportable={false}
              style={{ minWidth: "8rem" }}
            ></Column>
          </DataTable>
        </div>
      )}

      <Dialog
        visible={detailDialog}
        style={{ width: "450px" }}
        header="Detalle Productos"
        modal
        className="p-fluid"
        onHide={() => setDetailDialog(false)}
      >
        <div className="field">
          <label htmlFor="product">Materia Prima Usada</label>
          <Dropdown
            id="product"
            value={newDetail.product || newDetail.nombProd}
            itemTemplate={(name) => <div>{name.nombProd}</div>}
            valueTemplate={(name) => {
              if (name) {
                return <div>{name.nombProd}</div>;
              } else {
                return <div>Seleccione Producto</div>;
              }
            }}
            onChange={(e) => setNewDetail({ ...newDetail, product: e.value })}
            options={products}
            optionLabel="name"
            placeholder="Seleccione Producto"
          />
        </div>
        <div className="field">
          <label htmlFor="quantity">Cantidad Usada</label>
          <InputNumber
            id="quantity"
            value={newDetail.quantity}
            onValueChange={(e) =>
              setNewDetail({ ...newDetail, quantity: e.value })
            }
          />
        </div>
        {/*Unidad de Medida*/}       

        {newDetail && newDetail.product && newDetail.product.unidadProducto && (
          <div className="p-field">
            <label>Unidad de Medida: {newDetail.product.unidadProducto}</label>
          </div>)}
        {/*Unidad de Medida*/}
      
        <Button
          label="Grabar"
          icon="pi pi-check"
          className="p-button-success mt-3 centered"
          onClick={saveProductionDetail}
        />
      </Dialog>
    </div>
  );
};

export default Produccion;
