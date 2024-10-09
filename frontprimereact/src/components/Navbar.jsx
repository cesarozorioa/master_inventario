import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../utils/UserContext";
import { useEffect, useState } from "react";

const Navbar = () => {
  //const token = localStorage.getItem('token');
  const { setUser, userNamebd } = useUserContext();
  const navigate = useNavigate();
  
  const [usuario, setUsuario] = useState(null);
  useEffect(() => {
    
      setUsuario(userNamebd);
    
    
  }, [userNamebd]);

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
  return (
    <>
      <nav>
        <div className="card">
          <Menubar model={items} />
        </div>
      </nav>
    </>
  );
  //}
};

export default Navbar;
