import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import { useEffect } from "react";
import { useUserContext } from "../utils/UserContext";


const LayoutPublic = () => { 
  const {user}=useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <>
     
      <main className="container"> 
        
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