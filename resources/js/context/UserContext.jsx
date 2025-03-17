import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api_handler from "../libs/api_handler";
import { customSwal } from "../components/CustomSwal";
import { usePage } from "@inertiajs/react";

const UserContext = createContext(null)

export const UserProvider = ({ children, token, base_url }) => {
    
    const [userdata, setUserdata] = useState(null)
    const [loadingUserdata, setLoadingUserdata] = useState(false)


    return (
        <UserContext.Provider value={{ userdata, loadingUserdata, setUserdata, setLoadingUserdata }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)