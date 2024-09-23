//import Inventario from "./Inventario"
import LoginForm from "./LoginForm"
import { useUserContext } from "../utils/UserContext";

const Inicio = () => {

  const {user}=useUserContext();
  return (
    <>
    {
      !user ? <LoginForm />: <h1>Bienvenido {user.username}</h1>
    }
      
    </>
  )
}

export default Inicio