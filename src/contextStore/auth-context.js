import React, { useState } from 'react'

const AuthContext = React.createContext({
    token: "",
    isLoggedIn: false,
    logIn: (token) => { },
    logOut: (token) => { }

})

export const AuthContextProvider = (props) => {
    const [token, setToken] = useState("")

    const userIsLoggedIn = !!token

    const loginHandler = (token) => {
        setToken(token)
    }

    const logoutHandler = () => {
        setToken(null)
    }

    const contextValue = {
        token, 
        isLoggedIn: userIsLoggedIn, 
        logIn: loginHandler,
        logOut: logoutHandler
    }
    return (
    <AuthContext.Provider value={contextValue}>
        {props.children}
    </AuthContext.Provider>
    )
}

export default AuthContext