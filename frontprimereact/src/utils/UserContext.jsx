/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState,useEffect } from "react";

export const UserContext = createContext();

 const UserProvider = ({ children }) => {
    const [user, setUser] = useState(false);
    const [isSuperuser, setIsSuperuser] = useState(()=> {
        const storedIsSuperuser = localStorage.getItem("isSuperuser");
        return storedIsSuperuser ? storedIsSuperuser : false;  });
    const [userNamebd, setUsernamebd] = useState(() => {
        const storedUserName = localStorage.getItem("userNamebd");
        return storedUserName ? storedUserName : null;     
    });

    const [darkMode, setDarkMode] = useState(false);
    // Guarda el valor en localStorage cuando cambie
    useEffect(() => {
        if (userNamebd) {
          localStorage.setItem('userNamebd', userNamebd);         

        }
        if (isSuperuser) {
          localStorage.setItem('isSuperuser', isSuperuser);         
        } 
        if (darkMode) {
          localStorage.setItem('darkMode', darkMode);         
        }
      }, [userNamebd, isSuperuser, darkMode]);
      

    return (
        <UserContext.Provider value={{ user, setUser, userNamebd, setUsernamebd, isSuperuser, setIsSuperuser, darkMode, setDarkMode }} >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider
export const useUserContext =()=>useContext(UserContext)