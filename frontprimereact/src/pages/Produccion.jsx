import  { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import axios from 'axios';

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

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/v1/producto/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchProductions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/produccion/');
      setProductions(response.data);
    } catch (error) {
      console.error('Error fetching productions:', error);
    }
  };

  const fetchProductionDetails = async (productionId) => {
    console.log("productionId xxx: ", productionId);
    
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/detalle_produccion/?production=${productionId}/`);
      setProductionDetails(response.data);      
    } catch (error) {
      console.error('Error fetching production details:', error);
      
    }
    
  };
 
  

  const saveProduction = async () => {
    
    const newProduction1 = {
      idProdTerminado_fk:newProduction.product.idProducto,
      fechaProduccion: newProduction.production_date,
      cantProduccion: newProduction.quantity
    }
   
    try {
      if (selectedProduction) {
        await axios.put(`http://localhost:8000/api/v1/produccion/${selectedProduction.idProduccion}/`, newProduction1);
      } else {
        await axios.post('http://localhost:8000/api/v1/produccion/', newProduction1);
      }
      fetchProductions();
      setProductionDialog(false);
      setNewProduction({});
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Production saved', life: 3000 });
    } catch (error) {
      console.error('Error saving production:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error saving production', life: 3000 });
    }
  };

  const saveProductionDetail = async () => {
    console.log("newDetail: ", newDetail);
    const newDetail1 = {
      idProdu_fk:selectProduction.idProduccion,
      cantidadUsada: newDetail.quantity,
      idMateriaPrima_fk:newDetail.product.idProducto

    }
    console.log("newDetail1: ", newDetail1);
    try {
      if (newDetail.idProduccion) {
        await axios.put(`http://127.0.0.1:8000/api/v1/detalle_produccion/${newDetail.idProduccion}/`, newDetail1);
      } else {
        await axios.post('http://127.0.0.1:8000/api/v1/detalle_produccion/', newDetail1);
      }
      fetchProductionDetails(selectedProduction.idProduccion);
      setDetailDialog(false);
      setNewDetail({});
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Production detail saved', life: 3000 });
    } catch (error) {
      console.error('Error saving production detail:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error saving production detail', life: 3000 });
    }
  };

  const deleteProduction = async (production) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/produccion/${production.idProduccion}/`);
      fetchProductions();
      setSelectedProduction(null);
      setProductionDetails([]);
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Production deleted', life: 3000 });
    } catch (error) {
      console.error('Error deleting production:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error deleting production', life: 3000 });
    }
  };

  const deleteProductionDetail = async (detail) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/detalle_produccion/${detail.idProduccion}/`);
      fetchProductionDetails(selectedProduction.idProd_fk);
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Production detail deleted', life: 3000 });
    } catch (error) {
      console.error('Error deleting production detail:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error deleting production detail', life: 3000 });
    }
  };

  const openNew = () => {
    setSelectedProduction(null);
    setNewProduction({ production_date: new Date().toISOString().split('T')[0] });
    setProductionDialog(true);
  };

  const openNewDetail = () => {
    setNewDetail({ production: selectedProduction.idProduccion });
    setDetailDialog(true);
  };

  const editProduction = (production) => {
    console.log("production: ", production);
    setSelectedProduction(production);
    setNewProduction({ ...production });
    setProductionDialog(true);
  };

  const editProductionDetail = (detail) => {
    setNewDetail({ ...detail });
    setDetailDialog(true);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduction(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => deleteProduction(rowData)} />
        <Button icon="pi pi-list" className="p-button-rounded p-button-info" onClick={() => selectProduction(rowData)} />
      </>
    );
  };

  const detailActionBodyTemplate = (rowData) => {
    return (
      <>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProductionDetail(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => deleteProductionDetail(rowData)} />
      </>
    );
  };

  const selectProduction = (production) => {
    console.log("production: ", production);
    setSelectedProduction(production);
    fetchProductionDetails(production.idProduccion);
  };

  return (
    <div>
      <Toast ref={toast} />
      
      <div className="card">
        <h1>Production Management</h1>
        <Button label="New Production" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
        
        <DataTable value={productions} responsiveLayout="scroll">
          <Column field="id" header="ID"></Column>
          <Column field="product.name" header="Product"></Column>
          <Column field="production_date" header="Production Date"></Column>
          <Column field="quantity" header="Quantity"></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={productionDialog} style={{ width: '450px' }} header="Producto" modal className="p-fluid" onHide={() => setProductionDialog(false)}>
        <div className="field">
          <label htmlFor="product">Product</label>
          <Dropdown id="product" 
          value={newProduction.product}          
          onChange={(e) => setNewProduction({ ...newProduction, product: e.value })} options={products} optionLabel="name"          

          itemTemplate={(product) => <div>{product.nombProd}</div>} 
          valueTemplate={(product) => {
            if(product){
              return <div>{product.nombProd}</div>
            }
            else{
              return <div>Seleccione Producto</div>
            }
          }}          
          
          placeholder="Seleccione Producto" />
        </div>
        <div className="field">
          <label htmlFor="production_date">Production Date</label>
          <Calendar id="production_date" value={new Date(newProduction.production_date || '')} onChange={(e) => setNewProduction({ ...newProduction, production_date: e.value.toISOString().split('T')[0] })} showIcon />
        </div>
        <div className="field">
          <label htmlFor="quantity">Quantity</label>
          <InputNumber id="quantity" value={newProduction.quantity} onValueChange={(e) => setNewProduction({ ...newProduction, quantity: e.value })} />
        </div>
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduction} />
      </Dialog>

      {selectedProduction && (
        <div className="card mt-4">
          <h2>Production Details for Production #{selectedProduction.idProduccion}</h2>
          <Button label="New Detail" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNewDetail} />
          
          <DataTable value={productionDetails} responsiveLayout="scroll">
            <Column field="idProd_fk" header="ID"></Column>
            <Column field="product.nombProd" header="Product Used"></Column>
            <Column field="cantidadUsada" header="Quantity Used"></Column>
            <Column body={detailActionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
          </DataTable>
        </div>
      )}

      <Dialog visible={detailDialog} style={{ width: '450px' }} header="Detalle Productos" modal className="p-fluid" onHide={() => setDetailDialog(false)}>
        <div className="field">
          <label htmlFor="product">Product Used</label>
          <Dropdown id="product" 
          value={newDetail.product}
          itemTemplate={(product) => <div>{product.nombProd}</div>}
          valueTemplate={(product) => {
            if(product){
              return <div>{product.nombProd}</div>
            }
            else{
              return <div>Seleccione Producto</div>
            }
          }}
          onChange={(e) => setNewDetail({ ...newDetail, product: e.value })} options={products} optionLabel="name" placeholder="Seleccione Producto" />
        </div>
        <div className="field">
          <label htmlFor="quantity">Quantity Used</label>
          <InputNumber id="quantity" value={newDetail.quantity} onValueChange={(e) => setNewDetail({ ...newDetail, quantity: e.value })} />
        </div>
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProductionDetail} />
      </Dialog>
    </div>
  );
};

export default Produccion;