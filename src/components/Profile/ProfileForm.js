import classes from './ProfileForm.module.css';
import { useContext, useRef } from 'react'
import AuthContext from '../../contextStore/auth-context'
import { useHistory } from 'react-router-dom/'



const ProfileForm = () => {
  const history = useHistory()
  const { token } = useContext(AuthContext)
  const passRef = useRef()

  const passwordChangeHandler = (event) => {
    event.preventDefault()

    const currentPassRef = passRef.current.value

    const requestData = {
      idToken: token,
      password: currentPassRef,
      returnSecureToken: true
    }
    const changePassword = async () => {
      const request = await fetch(`${process.env.REACT_APP_FIREBASE_CHANGE_PASSWORD_URL}${process.env.REACT_APP_FIREBASE_API}`, {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await request.json()
      if (!request.ok) {
        throw new Error(response.error.message)
      }
      console.log("response", response)

    }
    changePassword().catch(error => alert(error))
    history.replace('/')
  }

  

  return (
    <form className={classes.form} onSubmit={passwordChangeHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={passRef} />
      </div>
      <div className={classes.action}>
        <button >Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
