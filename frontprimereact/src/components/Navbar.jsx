import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../utils/UserContext';

const Navbar = () => {
   
    const {user,setUser}=useUserContext();    
    const navigate = useNavigate();

    if(user){

    const items = [
       
        {
            label: 'Inicio',
            icon: 'pi pi-home',
            command: () => navigate('/'),      
            
        },
        {  
            label: 'Inventario',
            icon: 'pi pi-calculator',
            command: () => {navigate('/inventario')},
        },
        {
            label: 'Ingresos',
            icon: 'pi pi-book',
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
            icon: 'pi pi-cart-plus',
            command: () => {navigate('/pedido')},
        },
        {
            label: 'Reportes',
            icon: 'pi pi-chart-bar',
            items: [
                
                {
                    label: 'Ingresos',
                    icon: 'pi pi-chart-bar',
                    command: () => {navigate('/repingresos')},
                },
            ]
        },
        {
            label: 'Administracion  ',
            icon: 'pi pi-cog',
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
                    label: 'Sucursales',
                    icon: 'pi pi-palette', 
                    command: () => {navigate('/sucursal')},                   
                },
                {
                    label: 'Productos',
                    icon: 'pi pi-palette ',                    
                    command: () => {navigate('/productomanager')},
                },
            ]
        },
        {
            label: 'Salir',
            icon: 'pi pi-sign-out',command:()=>{
                setUser(false)
                navigate('/')
                
            },
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
}

export default Navbar