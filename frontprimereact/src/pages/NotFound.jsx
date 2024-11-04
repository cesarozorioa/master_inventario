import { useRouteError,Link } from "react-router-dom"

const NotFound = () => {
    const error = useRouteError();
    console.log(error)
  return (
    <div>
        <h1>Page Not Found</h1>       
        <Link to="/inicio">Volver al inicio</Link>
    </div>
  )
}

export default NotFound