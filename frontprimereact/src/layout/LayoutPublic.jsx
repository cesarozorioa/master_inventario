import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import { useEffect } from "react";
import { useUserContext } from "../utils/UserContext";

const LayoutPublic = () => {
  const { user, userNamebd } = useUserContext();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  console.log("token: ", token);

  useEffect(() => {
    if (!user && !token) {
      navigate("/");
    }
  }, [navigate, user, token]);

  return (
    <>
      <main className="container">
        <div className="text-center">
          {user && <h2>Usuario: {userNamebd}</h2>}
        </div>
        <div className="navbar">
          <Navbar />
        </div>
        <Outlet />
        <footer className="footer text-center">
          <h5>Inventarios - {new Date().getFullYear()}</h5>
        </footer>
      </main>
    </>
  );
};

export default LayoutPublic;
