//import Inventario from "./Inventario"
import LoginForm from "./LoginForm"
import { useUserContext } from "../utils/UserContext";

const Inicio = () => {

  const {user,userNamebd}=useUserContext();
  return (
    <>
    {
      !user ? <LoginForm />: <h1>Bienvenido {userNamebd}</h1>
    }
      
    </>
  )
}

export default Inicio