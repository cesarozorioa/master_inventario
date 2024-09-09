import { createBrowserRouter } from "react-router-dom";
import LayoutPublic from "../layouts/LayoutPublic";
import Contacto from "../pages/Contacto";
import Inicio from "../pages/Inicio";
import Produccion from "../pages/Produccion";
import Producto from "../pages/Producto";
import NotFound from "../pages/NotFound";

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
                path: "/producto",
                element: <Producto />,
                
            },
            {
                path: "/produccion",
                element: <Produccion />,
                
            },
            {
                path: "/contacto",
                element: <Contacto />,
                
            }, 
        ],
    }]);