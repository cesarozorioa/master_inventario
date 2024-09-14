import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const items = [
        {
            label: 'Inicio',
            icon: 'pi pi-home',
            command: () => navigate('/'),          
            
        },
        {
            label: 'Ingresos',
            icon: 'pi pi-star',
            items: [
                {
                    label: 'Entrada Productos',
                    icon: 'pi pi-bolt',
                    command: () => {navigate('/ingreso')},

                },
                
                {
                    label: 'Devoluciones',
                    icon: 'pi pi-pencil',
                    command: () => {navigate('/devolucion')},
                },
            ]
        },
        {
            label: 'Produccion',
            icon: 'pi pi-server',
            command: () => {navigate('/produccion')},
        },
        {
            label: 'Pedidos',
            icon: 'pi pi-server',
        },
        {
            label: 'Administracion  ',
            icon: 'pi pi-search',
            items: [
                {
                    label: 'Tipo de producto',
                    icon: 'pi pi-bolt',
                    command: () => {navigate('/tipoproducto')},
                },
                {
                    label: 'Categoria',
                    icon: 'pi pi-server',
                    command: () => {navigate('/categoria')},
                },
                {
                    label: 'distribuidores',
                    icon: 'pi pi-server',
                    command: () => {navigate('/distribuidor')},
                },
                {
                    label: 'Tipo de Pedidos',
                    icon: 'pi pi-pencil',
                    command: () => {navigate('/tipopedido')},
                },
                {
                    label: 'Sucursales',
                    icon: 'pi pi-palette', 
                    command: () => {navigate('/sucursal')},                   
                },
                {
                    label: 'Productos',
                    icon: 'pi pi-palette',
                    command: () => {navigate('/productomanager')},
                },
            ]
        },
        {
            label: 'Contact',
            icon: 'pi pi-envelope'
        }
    ];
  return (
    <>
      <div className="card">
            <Menubar model={items} />

        </div>
    </>
  )
}

export default Navbar