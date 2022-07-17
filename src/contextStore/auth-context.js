import React, { useState, useEffect, useCallback } from "react"

let logoutTimer

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  logIn: (token) => {},
  logOut: (token) => {},
})

const calcRemainingTime = (expirationTime) => {
  const currTime = new Date().getTime()
  const adjExpirationTime = new Date(expirationTime).getTime()

  const remainingTime = adjExpirationTime - currTime

  return remainingTime
}

const retreiveStoredToken = () => {
  const storedToken = localStorage.getItem("token")
  const storedExpirationDate = localStorage.getItem("expirationTime")

  const remainingTime = calcRemainingTime(storedExpirationDate)

  if (remainingTime <= 600000) {
    localStorage.removeItem("token")
    localStorage.removeItem("expirationTime")
    return null
  }

  return { token: storedToken, remainingTime: remainingTime }
}

export const AuthContextProvider = (props) => {
  const tokenData = retreiveStoredToken()
  console.log("tokenData.duration", tokenData)

  let intialToken
  if (tokenData) {
    intialToken = tokenData.token
  }

  const [token, setToken] = useState(intialToken)

  //   console.log("token", token)

  let userIsLoggedIn = token

  const logoutHandler = useCallback(() => {
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("expirationTime")
    if (logoutTimer) {
      clearTimeout(logoutTimer)
    }
  }, [])

  const loginHandler = useCallback(
    (token, expirationTime) => {
      setToken(token)
      localStorage.setItem("token", token)
      localStorage.setItem("expirationTime", expirationTime)
      const remainingTime = calcRemainingTime(expirationTime)

      logoutTimer = setTimeout(logoutHandler, remainingTime)
    },
    [logoutHandler]
  )

  useEffect(() => {
    if (!tokenData) {
      userIsLoggedIn = false
      logoutHandler()
    }

    if (tokenData) {
      loginHandler(tokenData.token, tokenData.remainingTime)
      logoutTimer = setTimeout(logoutHandler, tokenData.remainingTime)
    }

    return () => {}
  }, [logoutHandler, tokenData])

  console.log("logoutTimer", logoutTimer)

  const contextValue = {
    token,
    isLoggedIn: userIsLoggedIn,
    logIn: loginHandler,
    logOut: logoutHandler,
  }

  console.log("authContextState", contextValue)

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext
