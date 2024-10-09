import { createBrowserRouter } from "react-router-dom";
import { LayoutRoot } from "../layout/LayoutRoot";
import { LayoutPrivate } from "../layout/LayoutPrivate";
import NotFound from "../pages/NotFound";
import Inventario from "../pages/Inventario";
import TipoProducto from "../pages/TipoProducto";
import Categoria from "../pages/Categoria";
import Sucursal from "../pages/Sucursal";
import Distribuidor from "../pages/Distribuidor";
import IngresoProductos from "../pages/IngresoProductos";
import ProductoManager from "../pages/ProductoManager";
import Devolucion from "../pages/Devolucion";
import Produccion from "../pages/Produccion";
import Pedido from "../pages/Pedido";
import RepIngresos from "../pages/RepIngresos";
import RepPedidos from "../pages/RepPedidos";
import RepProducciones from "../pages/RepProducciones";
import Inicio from "../pages/Inicio";
//import Inicio from "../pages/Inicio";
import LoginForm from "../pages/LoginForm";

export const router = createBrowserRouter([

    {
        path: "/",
        element: <LayoutRoot />,
        errorElement: <NotFound />,
        children: [
            {
                path: "/loginform", 
                element: <LoginForm />,
                errorElement: <NotFound />,
                /*index: true,
                element: <LoginForm />,*/
                
            },
            {
                path: "/inicio",
                element: <LayoutPrivate />,
                errorElement: <NotFound />,
                         
                children: [
                    {
                        index: true,
                        element: <Inicio />,
                    },   
                    {
                        path: "/inicio/inventario",
                        element: <Inventario />,
                    }  ,          
                    
                    {
                        path: "/inicio/tipoproducto",
                        element: <TipoProducto />,
                    },
                    {
                        path: "/inicio/categoria",
                        element: <Categoria />,
                    },
                    {
                        path: "/inicio/sucursal",
                        element: <Sucursal />,
                    },
                    {
                        path: "/inicio/distribuidor",
                        element: <Distribuidor />,
                    },
                    {
                        path: "/inicio/productomanager",
                        element: <ProductoManager />,
                    },
                    {
                        path: "/inicio/ingreso",
                        element: <IngresoProductos />,
                    },
                    {
                        path: "/inicio/devolucion",
                        element: <Devolucion />,
                    },
                    {
                        path: "/inicio/produccion",
                        element: <Produccion />,
                    },
                    {
                        path: "/inicio/pedido",
                        element: <Pedido />,
                    },
                    {
                        path: "/inicio/repingresos",
                        element: <RepIngresos />,
                    },
                    {
                        path: "/inicio/reppedidos",
                        element: <RepPedidos />,
                    },
                    {
                        path: "/inicio/repproducciones",
                        element: <RepProducciones />,
                    },
                    {
                        path: "*",
                        element: <NotFound />,
                    }
                ]
            },
            

        ],

    },


])