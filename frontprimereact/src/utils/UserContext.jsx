/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState,useEffect } from "react";

export const UserContext = createContext();

 const UserProvider = ({ children }) => {
    const [user, setUser] = useState(false);
    const [userNamebd, setUsernamebd] = useState(() => {
        const storedUserName = localStorage.getItem("userNamebd");
        return storedUserName ? storedUserName : null;     
    });
    // Guarda el valor en localStorage cuando cambie
    useEffect(() => {
        if (userNamebd) {
          localStorage.setItem('userNamebd', userNamebd);
        }
      }, [userNamebd]);
      

    return (
        <UserContext.Provider value={{ user, setUser, userNamebd, setUsernamebd }} >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider
export const useUserContext =()=>useContext(UserContext)