//import Inventario from "./Inventario"

import { useUserContext } from "../utils/UserContext";
import RegisterForm from "./RegisterForm";

const Inicio = () => {
  const { userNamebd, isSuperuser } = useUserContext();
  return (
    <>
      {<h1 className="text-center">Bienvenido a la aplicación {userNamebd}</h1>}
      {isSuperuser && <RegisterForm />}
    </>
  );
};

export default Inicio;
