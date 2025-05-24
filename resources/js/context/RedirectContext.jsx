import { createContext, useContext, useState } from "react";

const RedirectContext = createContext(null);

export const RedirectProvider = ({ children }) => {
    const [showAnimation, setShowAnimation] = useState(true)

    const goTo = (path) => {
        setShowAnimation(false)
        setTimeout(() => {
            window.location.href = path
        }, 300)
        setShowAnimation(true)
    }

    return (
        <RedirectContext.Provider value={{ showAnimation, goTo }}>
            {children}
        </RedirectContext.Provider>
    );
};

export const useRedirect = () => useContext(RedirectContext);
