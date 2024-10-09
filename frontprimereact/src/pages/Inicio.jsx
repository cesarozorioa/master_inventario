//import Inventario from "./Inventario"

import { useUserContext } from "../utils/UserContext";

const Inicio = () => {

  const {userNamebd}=useUserContext();
  return (
    <>
    {
      
       <h1 className="text-center">Bienvenido a la aplicación {userNamebd}</h1>
    }
      
    </>
  )
}

export default Inicio