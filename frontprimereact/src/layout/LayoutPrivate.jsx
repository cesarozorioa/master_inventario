import { Outlet } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../utils/UserContext"
import { useEffect } from "react";

export const LayoutPrivate = () => {
  const { user,userNamebd,setDarkMode } = useUserContext();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  

  useEffect(() => {
    if (!user && !token) {
      navigate("/loginform");
    }     
    
  },[navigate, user, token]);
  const savedTheme = localStorage.getItem('theme');
  useEffect(() => {
    
    console.log("savedTheme>>>",savedTheme)
    if (savedTheme) {
        setDarkMode(savedTheme === 'dark');
    }
    
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [setDarkMode]);   
   console.log("usernamebd",userNamebd)
  return (    
    <Outlet />
  )
}
