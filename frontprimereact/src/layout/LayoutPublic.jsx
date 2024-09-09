import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const LayoutPublic = () => {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
        <footer className="footer text-center">
          <h5>Este es el footer</h5>
        </footer>
      </main>
    </>
  )
}

export default LayoutPublic