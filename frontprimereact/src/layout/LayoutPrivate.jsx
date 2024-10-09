import { Outlet } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../utils/UserContext"
import { useEffect } from "react";

export const LayoutPrivate = () => {
  const { user,userNamebd } = useUserContext();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user && !token) {
      navigate("/loginform");
    }
  },[navigate, user, token]);
   console.log("usernamebd",userNamebd)
  return (    
    <Outlet />
  )
}
