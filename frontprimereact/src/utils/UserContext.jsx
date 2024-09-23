/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

export const UserContext = createContext();

 const UserProvider = ({ children }) => {
    const [user, setUser] = useState(false);
    const [userNamebd, setUsernamebd] = useState("");

    return (
        <UserContext.Provider value={{ user, setUser, userNamebd, setUsernamebd }} >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider
export const useUserContext =()=>useContext(UserContext)