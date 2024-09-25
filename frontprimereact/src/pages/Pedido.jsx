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

const Pedido = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoDetails, setPedidoDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [pedidoDialog, setPedidoDialog] = useState(false);
  const [detailDialog, setDetailDialog] = useState(false);
  const [newPedido, setNewPedido] = useState({});
  const [newDetail, setNewDetail] = useState({});
  const [sucursales, setSucursales] = useState([]);
  const toast = useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchPedidos();
    fetchSucursales();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/v1/producto/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const obtenerNombreProducto = (idProd_fk) => {    
    const producto = products.find((prod) => prod.idProducto === idProd_fk);
    console.log("producto: ",producto)
    return producto ? producto.nombProd : 'Desconocido';
  };

  const fetchSucursales = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/v1/sucursal/');
      setSucursales(response.data);
    } catch (error) {
      console.error('Error fetching sucursales:', error);}
    }

  const fetchPedidos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/pedido/');
      setPedidos(response.data);
    } catch (error) {
      console.error('Error fetching pedidos:', error);
    }
  };

  const fetchPedidoDetails = async (pedidoId) => {      
    
    try {      
      
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/detalle_pedido/?idPed_fk=${pedidoId}`);
      setPedidoDetails(response.data);        
    } catch (error) {
      console.error('Error fetching production details:', error);
      
    }
    
  };   

  const savePedido = async () => {
    console.log("newPedido en saveProduction: ",newPedido );
    
    const newPedido1 = {
      idSucursal_fk:newPedido.sucursal.idSucursal,
      fechaPedido: newPedido.pedido_date,
      
    }
   
    try {
      if (selectedPedido) {
        await axios.put(`http://localhost:8000/api/v1/pedido/${selectedPedido.idPedido}/`, newPedido1);
      } else {
        await axios.post('http://localhost:8000/api/v1/pedido/', newPedido1);
      }
      fetchPedidos();
      setPedidoDialog(false);
      setNewPedido({});
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Pedido saved', life: 3000 });
    } catch (error) {
      console.error('Error saving pedido:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error saving production', life: 3000 });
    }
  };

  const savePedidoDetail = async () => {
    console.log("newDetail en savePedidoDetail: ",newDetail );
    console.log("selectedPedido: ",selectedPedido);
    /*const { id:idDetalleP } = newDetail;
    const { idPedido: pedidoId } = selectedPedido;*/
    const newDetail1 = {
      //id:newDetail.id,
      idPed_fk:selectedPedido.idPedido,
      cantidadPedido: newDetail.quantity,
      idProd_fk:newDetail.product.idProducto
    }
   
    try {
      console.log("newDetail1: yyyyyy ", newDetail1);
      console.log("newDetail: ", newDetail);
      if (newDetail.id) {    
        alert("id: "+newDetail.id);    
        await axios.put(`http://127.0.0.1:8000/api/v1/detalle_pedido/${newDetail.id}/`,newDetail1);
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Pedido Actualizado', life: 3000 });
      } else if (newDetail.product.stock >= newDetail.quantity) {
        
        await axios.post('http://127.0.0.1:8000/api/v1/detalle_pedido/', newDetail1);
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Pedido Guardado', life: 3000 }); 
        
      }else{
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'No hay suficiente stock', life: 3000 });
      }
      fetchPedidoDetails(selectedPedido.idPedido);
      setDetailDialog(false);
      setNewDetail({}); 
        
    } catch (error) {
      console.error('Error saving pedido detail:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error saving production detail', life: 3000 });
    }
  };

  const deletePedido = async (pedido) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/pedido/${pedido.idPedido}/`);
      fetchPedidos();
      setSelectedPedido(null);
      setPedidoDetails([]);
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Pedido deleted', life: 3000 });
    } catch (error) {
      console.error('Error deleting pedido:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error deleting production', life: 3000 });
    }
  };

  const deletePedidoDetail = async (detail) => {
    console.log("en delete el detalle: ", detail)
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/detalle_pedido/${detail.idDetalleP}/`);
      fetchPedidoDetails(selectedPedido.idPedido);
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Pedido detail deleted', life: 3000 });
    } catch (error) {
      console.error('Error deleting pedido detail:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error deleting production detail', life: 3000 });
    }
  };

  const openNew = () => {
    setSelectedPedido(null);
    setNewPedido({ pedido_date: new Date().toISOString().slice(0, 10) });
    setPedidoDialog(true);
  };

  const openNewDetail = () => {
    setNewDetail({ pedido: selectedPedido.idPedido });
    setDetailDialog(true);
  };

  const editPedido = (pedido) => {
    console.log("en edit pedido: ", pedido)
    
    let pro
    setSelectedPedido(pedido);
    const { idSucural_fk: p }=pedido;
    console.log ("p: ", p);
    sucursales.map((suc) => {
      if(suc.nombSucursal===p)
           pro=suc.idSucursal
             
    })
    
    setNewPedido({
      id: pedido.idPedido,
      sucursal: pro,      
      pedido_date: pedido.fechaPedido
    });
    //agregado
    fetchPedidoDetails(pedido.idPedido);
    setPedidoDialog(true);
  };

  const editPedidoDetail = (detail) => {
    
   
    setNewDetail({
      id: detail.idDetalleP,
      pedido: detail.idPed_fk,
      product: detail.idProd_fk,
      quantity: detail.cantidadPedido
    });
    
    setDetailDialog(true);
    
  };
  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editPedido(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => deletePedido(rowData)} />
        <Button icon="pi pi-list" className="p-button-rounded p-button-info" onClick={() => selectPedido(rowData)} />
      </>
    );
  };

  const detailActionBodyTemplate = (rowData) => {
    return (
      <>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editPedidoDetail(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => deletePedidoDetail(rowData)} />
      </>
    );
  };

  const selectPedido = (pedido) => {
    
    setSelectedPedido(pedido);
    fetchPedidoDetails(pedido.idPedido);
  };

  return (
    <div>
      <Toast ref={toast} />
      
      <div className="card">
        <h1>Ingreso de Pedidos</h1>
        <Button label="New Pedido" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
        
        <DataTable value={pedidos} responsiveLayout="scroll">
          <Column field="idPedido" header="ID"></Column>
          <Column field="idSucursal_fk" header="Sucursal"></Column>
          <Column field="fechaPedido" header="Fecha"></Column>         
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={pedidoDialog} style={{ width: '450px' }} header="Sucursal" modal className="p-fluid" onHide={() => setPedidoDialog(false)}>
        <div className="field">
          <label htmlFor="sucursal">Sucursal</label>
          <Dropdown id="sucursal" value={newPedido.sucursal || newPedido.nombSucursal}
          onChange={(e) => setNewPedido({ ...newPedido, sucursal: e.value })}
          options={sucursales}
          itemTemplate={(name) => <div>{name.nombSucursal}</div>}
          valueTemplate={(name) => {
            if(name){

              return <div>{name.nombSucursal}</div>
          }
          else{
              return <div>Seleccione Sucursal</div>
          }}}
          optionLabel="name" 
          optionValue="id" 
          placeholder="Select Sucursal" />
        </div>
        <div className="field">
          <label htmlFor="pedido_date">Pedido Date</label>
          <Calendar id="pedido_date" value={new Date(newPedido.pedido_date)} 
          onChange={(e) => setNewPedido({ ...newPedido, pedido_date: e.value.toISOString().slice(0, 10) })} showIcon />
        </div>
       
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savePedido} />
      </Dialog>

      {selectedPedido && (
        <div className="card mt-4">
          <h2> Detalles del Pedido #{selectedPedido.idPedido}</h2>
          <Button label="Productos" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNewDetail} />
          
          <DataTable value={pedidoDetails} showGridlines tableStyle={{ minWidth: '50rem' }} scrollable scrollHeight="400px"  >
            <Column field="idPed_fk" header="PEDIDO"></Column>
            <Column field="idProd_fk" header="Product Pedido"
            body={(rowData) => obtenerNombreProducto(rowData.idProd_fk)}
            />
            <Column field="cantidadPedido" header="Quantity Used"></Column>
            <Column body={detailActionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
          </DataTable>
        </div>
      )}

      <Dialog visible={detailDialog} style={{ width: '450px' }} header="Detalle Productos" modal className="p-fluid" onHide={() => setDetailDialog(false)}>
        <div className="field">
          <label htmlFor="product">Product Pedidos</label>
          <Dropdown id="product" 
          value={newDetail.product || newDetail.nombProd}       
          itemTemplate={(name) => <div>{name.nombProd}</div>}
          valueTemplate={(name) => {
            if(name){
              return <div>{name.nombProd}</div>
          }
          else{
              return <div>Seleccione Producto</div>
          }}}
          onChange={(e) => setNewDetail({ ...newDetail, product: e.value })} options={products} optionLabel="name" placeholder="Seleccione Producto" />
        </div>
        <div className="field">
          <label htmlFor="quantity">Quantity Used</label>
          <InputNumber id="quantity" value={newDetail.quantity} onValueChange={(e) => setNewDetail({ ...newDetail, quantity: e.value })} />
        </div>
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savePedidoDetail} />
      </Dialog>
    </div>
  );
};
export default Pedido;