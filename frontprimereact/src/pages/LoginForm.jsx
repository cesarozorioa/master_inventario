import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import axios from "axios";
import { useUserContext } from "../utils/UserContext";

export default function LoginForm() {
  const { setUser, user, setUsernamebd,setIsSuperuser } = useUserContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  //const [ setIsSuperuser] = useState(false);

  const navigate = useNavigate();

  const toast = React.useRef(null);
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token");
      
      axios
          .get("http://127.0.0.1:8000/acceso/get_is_superuser", {
            headers: {
              Authorization: `Token ${token}`, // Aquí va el token en el encabezado
            },
          })
          .then((response) => {
            console.log("Es superusuario:", response.data.is_superuser);
            setIsSuperuser(response.data.is_superuser);
          })
          .catch((error) => {
            console.error("Error al verificar superusuario", error);
          });

      navigate("/inicio");
    }
  }, [user, navigate,setIsSuperuser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/acceso/login/", {
        username,
        password,
      });

      if (response.data.token) {
        /* codigo para verificar si e superuser*/

        console.log("Respuesta de inicio de sesión:", response.data);
        console.log("Respuesta de inicio de sesión:", response.data.token);
        
        // Guardar el token en el almacenamiento local o en el estado global
        localStorage.setItem("token", response.data.token);
        setUsernamebd(username);
        setUser(true);
        
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Inicio de sesión exitoso",
          life: 2000,
        });
      } else {
        throw new Error("No se recibió token");
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Credenciales inválidas",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card title="Iniciar Sesión" className="w-full max-w-md p-6 ">
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field mb-4">
            <span className="p-float-label">
              <InputText
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="username">Usuario</label>
            </span>
          </div>
          <div className="field mb-4">
            <span className="p-float-label">
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                feedback={false}
                required
              />
              <label htmlFor="password">Contraseña</label>
            </span>
          </div>
          <Button
            type="submit"
            label="Iniciar Sesión"
            className="mt-2"
            loading={loading}
          />
        </form>
      </Card>
      <Toast ref={toast} />
    </div>
  );
}
