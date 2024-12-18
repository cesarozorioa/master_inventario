import { Outlet } from "react-router-dom";
import NavBar from "../components/Navbar";

export const LayoutRoot = () => {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>

      <footer className="footer text-center">
        <h5>Inventarios - {new Date().getFullYear()}</h5>
      </footer>
    </>
  );
};
