import  { useState,useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from "primereact/toast";
import axios from 'axios';

const RegisterForm=()=> {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useRef(null);
  

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/acceso/register/', {
        username,
        email,
        password
      });
      console.log('Usuario registrado:', response.data);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Usuario Registrado exitosamente",        
      });
      
      setUsername('')
      setPassword('')
      setEmail('')      
      // Aquí puedes agregar lógica adicional, como mostrar un mensaje de éxito
    } catch (error) {
      console.error('Error al registrar:', error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear el usuario",
      });
      // Aquí puedes manejar los errores, como mostrar un mensaje de error
    }
  };

  return (
    <>
    <Toast ref={toast} />
    <Card title="Registro de Usuario" className="w-25rem mx-auto mt-5">
      <form onSubmit={handleRegister} className="p-fluid">
        <div className="field">
          <span className="p-float-label">
            <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label htmlFor="username">Nombre de usuario</label>
          </span>
        </div>
        <div className="field">
          <span className="p-float-label">
            <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="email">Correo electrónico</label>
          </span>
        </div>
        <div className="field">
          <span className="p-float-label">
            <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} />
            <label htmlFor="password">Contraseña</label>
          </span>
        </div>
        <Button type="submit" label="Registrarse" className="mt-2" />
      </form>
    </Card>
    </>
  );
}
export default RegisterForm