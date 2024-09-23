import { createBrowserRouter } from "react-router-dom";
import Inicio from "../pages/Inicio";
import NotFound from "../pages/NotFound";
import LayoutPublic from "../layout/LayoutPublic";
import TipoProducto from "../pages/TipoProducto";
import Sucursal from "../pages/Sucursal";
import Categoria from "../pages/Categoria";
import Distribuidor from "../pages/Distribuidor";
import ProductoManager from "../pages/ProductoManager";
import IngresoProductos from "../pages/IngresoProductos";
import Devolucion from "../pages/Devolucion";
import Produccion from "../pages/Produccion";
import Pedido from "../pages/Pedido";
import Inventario from "../pages/Inventario";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPublic />,
    errorElement: <NotFound />,
    children: [     
        {
            index: true,
            element: <Inicio />,
        },                 
            
              {
               path: "/inventario",
                element: <Inventario />,
              },
        
              {
                path: "/tipoproducto",
                element: <TipoProducto />,
              },
              {
                path: "/categoria",
                element: <Categoria />,
              },
        
              {
                path: "/sucursal",
                element: <Sucursal />,
              },
              {
                path: "/distribuidor",
                element: <Distribuidor />,
              },
              {
                path: "/productomanager",
                element: <ProductoManager />,
              },
        
              {
                path: "/ingreso",
                element: <IngresoProductos />,
              },
              {
                path: "/devolucion",
                element: <Devolucion />,
              },
              {
                path: "/produccion",
                element: <Produccion />,
              },
              {
                path: "/pedido",
                element: <Pedido />,
              },
        
              {
                path: "*",
                element: <NotFound />,
              },
            ],
          },   
  
]);
