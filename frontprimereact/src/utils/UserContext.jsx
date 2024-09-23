/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

export const UserContext = createContext();

 const UserProvider = ({ children }) => {
    const [user, setUser] = useState(false);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider
export const useUserContext =()=>useContext(UserContext)