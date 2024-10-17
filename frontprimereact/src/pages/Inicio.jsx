//import Inventario from "./Inventario"

import { useUserContext } from "../utils/UserContext";
import RegisterForm from "./RegisterForm";

const Inicio = () => {

  const {userNamebd}=useUserContext();
  return (
    <>
    {
      
       <h1 className="text-center">Bienvenido a la aplicación {userNamebd}</h1>
    }
      <RegisterForm />
    </>
  )
}

export default Inicio