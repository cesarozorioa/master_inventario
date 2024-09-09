import {  NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark ">
    <div className="container">
      <NavLink className="btn btn-outline-primary" to="/"> Inicio </NavLink>
      <NavLink className="btn btn-outline-primary" to="/producto">Productos</NavLink>
      <NavLink className="btn btn-outline-primary" to="/produccion">Produccion</NavLink>
      <NavLink className="btn btn-outline-primary" to="/contacto">Contacto</NavLink>
    </div>
  </nav>
  )
}

export default Navbar