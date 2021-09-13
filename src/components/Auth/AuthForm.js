import { useState, useRef } from "react";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const passRef = useRef();
  const emailRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailRef.current.value;
    const enteredPassword = passRef.current.value;

    const enteredData = {
      email: enteredEmail,
      password: enteredPassword,
      returnSecureToken: true,
    };

    if (isLogin) {
    }

    if (!isLogin) {
      const signUp = async () => {
        setIsLoading(true);

        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.FIREBASE_API}`,
          {
            method: "POST",
            body: JSON.stringify(enteredData),
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error.message || "could not authenticate");
        }

        setIsLoading(false);
        return data;
      };
      if (enteredEmail.length > 4 && enteredPassword.length > 4) {
        signUp().catch((err) => {
          alert(err);
          setIsLoading(false);
        });
      }
    }
  };

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
          <input type="password" id="password" required ref={passRef} />
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
  );
};

export default AuthForm;
