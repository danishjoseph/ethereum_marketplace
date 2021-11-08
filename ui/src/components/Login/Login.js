import { useReducer,useState } from 'react'
import './Login.css'
const emailReducer = (prevState, action) => {
    if (action.type === 'USER_INPUT') {
        return ({ value: action.val, isValid: action.val.includes('@') })
    }
    if (action.type === 'INPUT_BLUR') {
        return ({ value: prevState.value, isValid: prevState.value.includes('@') })
    }
    return ({ value: '', isValid: false })
}

const passwordReducer = (prevState, action) => {
    if (action.type === 'USER_INPUT') {
        return ({ value: action.val, isValid: action.val.trim().length > 6 })
    }
    if (action.type === 'INPUT_BLUR') {
        return ({ value: prevState.value, isValid: prevState.value.trim().length > 6 })
    }
    return ({ value: '', isValid: false })
}

function Login(props) {

    const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: true })
    const [passwordState, dispatchPassword] = useReducer(passwordReducer, { value: '', isValid: true })
    const [formIsValid, setFormIsValid] = useState(false);

    const emailChangeHandler = (event) => {
        dispatchEmail({ type: 'USER_INPUT', val: event.target.value })

        setFormIsValid(
            emailState.value.includes('@') && passwordState.value.trim().length > 6
        );
    };

    const validateEmailHandler = () => {
        dispatchEmail({ type: 'INPUT_BLUR' })
    }

    const passwordChangeHandler = (event) => {
        dispatchPassword({ type: "USER_INPUT", val: event.target.value })

        setFormIsValid(
            passwordState.value.trim().length > 6 && emailState.value.includes('@')
        );
    };

    const validatePasswordHandler = () => {
        dispatchPassword({ type: 'INPUT_BLUR' })
    }

    const submitHandler = (event) => {
        event.prevenDefault()
        props.onLogin(emailState.value, passwordState.value);
    }

    return (
        <div className="login-card">
            <h2>Login</h2>
            <form onSubmit={submitHandler}>
                <div
                    className={`control ${emailState.isValid === false ? 'invalid' : ''
                        }`}
                >
                    <label htmlFor="email">E-Mail</label>
                    <input
                        type="email"
                        id="email"
                        value={emailState.value}
                        onChange={emailChangeHandler}
                        onBlur={validateEmailHandler}
                    />
                </div>
                <div
                    className={`control ${passwordState.isValid === false ? 'invalid' : ''
                        }`}
                >
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={passwordState.value}
                        onChange={passwordChangeHandler}
                        onBlur={validatePasswordHandler}
                    />
                </div>
                <div className='actions'>
                    <button className='button' type="submit" disabled={!formIsValid}>
                        Login
                    </button>
                </div>
            </form>
        </div>
    );

}
export default Login