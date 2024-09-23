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
            icon: 'pi pi-star',
            command: () => {navigate('/inventario')},
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
            command: () => {navigate('/pedido')},
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
            label: 'Salir',
            icon: 'pi pi-envelope',command:()=>{
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