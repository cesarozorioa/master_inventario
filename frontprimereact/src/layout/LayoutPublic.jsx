import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import { useEffect } from "react";
import { useUserContext } from "../utils/UserContext";


const LayoutPublic = () => { 
  const {user,userNamebd}=useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <>
     
      <main className="container"> 
        <div className="text-center">
          {user && <h2>Usuario: {userNamebd}</h2>}
        </div>
        
        <Navbar/>
        <Outlet />
        <footer className="footer text-center">
          <h5>Este es el footer</h5>
        </footer>
      </main>
    </>
  )
}

export default LayoutPublic