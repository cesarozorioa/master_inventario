import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import Produccion from "./pages/Produccion";
import Contacto from "./pages/Contacto";
import Producto from "./pages/Producto";
import { Routes, Route } from "react-router-dom";
import LayoutPublic from "./layouts/LayoutPublic";

function App() {
  return (
    <>
      <Navbar />     
        <Routes>
          <Route path ="/" element={<LayoutPublic />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/Producto" element={<Producto />} />
            <Route path="/Produccion" element={<Produccion />} />
            <Route path="/Contacto" element={<Contacto />} />
          </Route>
        </Routes>
     
    </>
  );
}

export default App;
