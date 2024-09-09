import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const LayoutPublic = () => {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
        <footer>Este es el footer</footer>
      </main>
    </>
  );
};

export default LayoutPublic;
