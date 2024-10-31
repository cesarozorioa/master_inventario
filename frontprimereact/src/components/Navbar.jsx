import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../utils/UserContext";
import { useEffect, useState } from "react";
import { Button } from 'primereact/button';
import './Navbar.css';

const Navbar = () => {
  //const token = localStorage.getItem('token');
  const { setUser, userNamebd } = useUserContext();
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();  
  const [usuario, setUsuario] = useState(null);
  const toggleTheme = () => {
    setDarkMode(!darkMode);
};
  useEffect(() => {
    const themeLink = document.getElementById('app-theme');
    if (darkMode) {
        themeLink.setAttribute('href', 'https://unpkg.com/primereact/resources/themes/lara-dark-indigo/theme.css');
    } else {
        themeLink.setAttribute('href', 'https://unpkg.com/primereact/resources/themes/lara-light-indigo/theme.css');
    }
    
      setUsuario(userNamebd);
    
    
  }, [userNamebd, darkMode]);

  // if(user){

  const items = [
    
    
    {
      label: "Inicio",
      icon: "pi pi-home",
      command: () => navigate("/inicio"),
    },
    {
      label: "Inventario",
      icon: "pi pi-calculator",
      command: () => {
        navigate("/inicio/inventario");
      },
    },
    {
      label: "Ingresos",
      icon: "pi pi-book",
      items: [
        {
          label: "Entrada Productos",
          icon: "pi pi-bolt",
          command: () => {
            navigate("/inicio/ingreso");
          },
        },

        {
          label: "Devoluciones",
          icon: "pi pi-pencil",
          command: () => {
            navigate("/inicio/devolucion");
          },
        },
      ],
    },
    {
      label: "Produccion",
      icon: "pi pi-server",
      command: () => {
        navigate("/inicio/produccion");
      },
    },
    {
      label: "Pedidos",
      icon: "pi pi-cart-plus",
      command: () => {
        navigate("/inicio/pedido");
      },
    },
    {
      label: "Reportes",
      icon: "pi pi-print",
      items: [
        {
          label: "Ingresos",
          icon: "pi pi-book",
          command: () => {
            navigate("/inicio/repingresos");
          },
        },
        {
          label: "Pedidos",
          icon: "pi pi-pen-to-square",
          command: () => {
            navigate("/inicio/reppedidos");
          },
        },
        {
          label: "Produccion",
          icon: "pi pi-server",
          command: () => {
            navigate("/inicio/repproducciones");
          },
        },
      ],
    },
    {
      label: "Administracion  ",
      icon: "pi pi-cog",
      items: [
        {
          label: "Tipo de producto",
          icon: "pi pi-bolt",
          command: () => {
            navigate("/inicio/tipoproducto");
          },
        },
        {
          label: "Categoria",
          icon: "pi pi-server",
          command: () => {
            navigate("/inicio/categoria");
          },
        },
        {
          label: "distribuidores",
          icon: "pi pi-server",
          command: () => {
            navigate("/inicio/distribuidor");
          },
        },

        {
          label: "Sucursales",
          icon: "pi pi-palette",
          command: () => {
            navigate("/inicio/sucursal");
          },
        },
        {
          label: "Productos",
          icon: "pi pi-palette ",
          command: () => {
            navigate("/inicio/productomanager");
          },
        },
      ],
    },
    {
      label: "Salir",
      icon: "pi pi-sign-out",
      command: () => {
        setUser(false);        
        setUsuario("");
        localStorage.removeItem("token");
        localStorage.removeItem('userNamebd');
        localStorage.clear();
        navigate("/loginform");
      },
    },
    {
      label: usuario,
      icon: "pi pi-user",
    },    
        
  ];

  const themeToggleButton = (
    <Button
        label={darkMode ? "Modo Claro" : "Modo Oscuro"}
        icon={darkMode ? "pi pi-sun" : "pi pi-moon"}
        onClick={toggleTheme}
        className="p-button-rounded p-button-text"
    />
);
  return (
    <>
      <nav>
        <div className="card navbar-container ">
          <Menubar model={items} end={themeToggleButton} />             
        </div>
      </nav>
    </>
  );
  //}
};

export default Navbar;
