import { Outlet } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../utils/UserContext"
import { useEffect } from "react";



export const LayoutPrivate = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/loginform");

    }
  },[navigate, user])
  return (    
    <Outlet />
  )
}
