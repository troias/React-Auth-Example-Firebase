import { useState, useRef, useContext } from "react"
import { useHistory } from "react-router-dom"
import AuthContext from "../../contextStore/auth-context"
import classes from "./AuthForm.module.css"

const AuthForm = () => {
  const history = useHistory()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const passRef = useRef()
  const emailRef = useRef()
  const authCtx = useContext(AuthContext)

  console.log("authCtxState", authCtx.token)

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState)
  }

  const submitHandler = (event) => {
    event.preventDefault()

    const enteredEmail = emailRef.current.value
    const enteredPassword = passRef.current.value

    const enteredData = {
      email: enteredEmail,
      password: enteredPassword,
      returnSecureToken: true,
    }

    if (isLogin) {
      setIsLoading(true)

      const signIn = async () => {
        const request = await fetch(
          `${process.env.REACT_APP_FIREBASE_SIGN_IN_URL}${process.env.REACT_APP_FIREBASE_API}`,
          {
            method: "POST",
            body: JSON.stringify(enteredData),
            headers: { "Content-Type": "application/json" },
          }
        )

        const response = await request.json()

        console.log("response", response)

        if (!request.ok) {
          throw new Error(response.error.message)
        }

        const expirationTime = new Date(
          new Date().getTime() + +response.expiresIn * 1000
        )

        authCtx.logIn(response.idToken, expirationTime.toISOString())
      }

      if (enteredEmail.length > 4 && enteredPassword.length > 4) {
        signIn().catch((error) => {
          alert(error)
          setIsLoading(false)
        })
        setIsLoading(false)
        history.replace("/")
      }
    }

    if (!isLogin) {
      const signUp = async () => {
        setIsLoading(true)
        const response = await fetch(
          `${process.env.REACT_APP_FIREBASE_SIGN_UP_URL}${process.env.REACT_APP_FIREBASE_API}`,
          {
            method: "POST",
            body: JSON.stringify(enteredData),
            headers: { "Content-Type": "application/json" },
          }
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error.message || "could not authenticate")
        }

        setIsLoading(false)
        return data
      }
      if (enteredEmail.length > 4 && enteredPassword.length > 4) {
        signUp().catch((err) => {
          alert(err)
          setIsLoading(false)
          history.replace("/")
        })
      }
      setIsLoading(false)
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onClick={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            minLength="7"
            required
            ref={passRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p> loading </p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AuthForm
