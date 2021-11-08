import { useReducer, useState } from 'react'
import './Register.css'
const emailReducer = (prevState, action) => {
    if (action.type === 'USER_INPUT') {
        return ({ value: action.val, isValid: action.val.includes('https://') })
    }
    if (action.type === 'INPUT_BLUR') {
        return ({ value: prevState.value, isValid: prevState.value.includes('https://') })
    }
    return ({ value: '', isValid: false })
}

const priceReducer = (prevState, action) => {
    if (action.type === 'USER_INPUT') {
        return ({ value: action.val, isValid: isNormalInteger(action.val) })
    }
    if (action.type === 'INPUT_BLUR') {
        return ({ value: prevState.value, isValid: isNormalInteger(prevState.value) })
    }
    return ({ value: '', isValid: false })
}

function isNormalInteger(str) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
}

function Register(props) {

    const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: true })
    const [priceState, dispatchPrice] = useReducer(priceReducer, { value: '', isValid: true })
    const [formIsValid, setFormIsValid] = useState(false);
    const [amount, setAmount] = useState("")
    const emailChangeHandler = (event) => {
        dispatchEmail({ type: 'USER_INPUT', val: event.target.value })

        setFormIsValid(
            isNormalInteger(priceState.value) && emailState.value.includes('https://')
        );
    };

    const validateEmailHandler = () => {
        dispatchEmail({ type: 'INPUT_BLUR' })
    }

    const priceChangeHandler = (event) => {
        dispatchPrice({ type: "USER_INPUT", val: event.target.value })

        setFormIsValid(
            isNormalInteger(priceState.value) && emailState.value.includes('https://')
        );
    };

    const validatePriceHandler = () => {
        dispatchPrice({ type: 'INPUT_BLUR' })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        props.onRegister(emailState.value, priceState.value);
    }

    const handleERC20Submit = (e) => {
        e.preventDefault()
        props.onMint(amount);
        setAmount("")
    }

    const amountChangeHandler = (e) => {
        setAmount(e.target.value)
    }

    if (props.formType === "ERC721") {
        return (
            <div className="register-page">
                <h2>{props.title}</h2>
                <form onSubmit={handleSubmit}>
                    <div
                        className={`control ${emailState.isValid === false ? 'invalid' : ''
                            }`}
                    >
                        <label htmlFor="ipfs">IPFS URL :</label>
                        <input
                            type="url"
                            id="tokenurl"
                            value={emailState.value}
                            onChange={emailChangeHandler}
                            onBlur={validateEmailHandler}
                        />
                    </div>
                    <div
                        className={`control ${priceState.isValid === false ? 'invalid' : ''
                            }`}
                    >
                        <label htmlFor="price">Price :</label>
                        <input
                            type="price"
                            id="price"
                            value={priceState.value}
                            onChange={priceChangeHandler}
                            onBlur={validatePriceHandler}
                        />
                    </div>

                    <div className='actions'>
                        <button className='button' type="submit" disabled={!formIsValid}>
                            Mint
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    else if (props.formType === "ERC20") {
        return (
            <div className="register-page">
                <h2>{props.title}</h2>
                <form onSubmit={handleERC20Submit}>
                    <div className="control">
                        <label htmlFor="erc20">Quantity :</label>
                        <input
                            type="number"
                            id="erc20"
                            placeholder="swap ethers with marketplace token.."
                            value={amount}
                            onChange={amountChangeHandler}
                        />
                    </div>
                    <div className='actions'>
                        <button className='button' type="submit">
                            Mint
                        </button>
                    </div>
                </form>
            </div>
        );

    }



}
export default Register