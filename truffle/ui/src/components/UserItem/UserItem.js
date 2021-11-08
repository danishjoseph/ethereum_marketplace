import React, { useState } from 'react'
import { FaSpinner } from 'react-icons/fa';
import { updateNftPrice,updateNftStatus } from '../../web3Config'
import './UserItem.css'
function UserItem(props) {
    
    const renderHandler = () => {
        props.onUpdateChild()
    }

    const [newPrice, setNewPrice] = useState("")
    const [isLoading, setIsLoading] = useState(false)


    const handleChange = (e) => {
        setNewPrice(e.target.value)
    }

    const updatePriceHandler = async (itemId) => {
        setIsLoading(true)
        await updateNftPrice(itemId, newPrice)
        setNewPrice("")
        setIsLoading(false)
        renderHandler()
    }

    const statusHandler = async (id, status) => {
        setIsLoading(true)
        await updateNftStatus(id, status)
        setIsLoading(false)
        renderHandler()
    }

    return (
        <div className="user-card">
            <div className="user-card-container">
                <span className="user-card-pro">{props.price}</span>
                <img className="user-card-round" src={props.url} alt={props.itemId} />
                <h3>{props.name}</h3>
            </div>
            <div className="user-card-buttons">
                <button value={props.itemId}
                    className={`${props.status ? "user-card-primary" : "user-card-primary user-card-ghost"}`}
                    onClick={() => statusHandler(props.itemId, !props.status)}>
                    {props.status ? "Enabled" : "Disabled"}
                </button>
                <input
                    type="text"
                    name="newprice"
                    placeholder="Enter new price here..."
                    value={newPrice}
                    onChange={handleChange}
                />
                <button value={props.itemId}
                    className={`${props.status ? "user-card-primary user-card-ghost" : "user-card-primary "}`}
                    onClick={() => updatePriceHandler(props.itemId)}>
                    {isLoading ? <FaSpinner icon="spinner" className="spinner" /> : "Update Price"}
                </button>
            </div>
        </div>
    )


}

export default UserItem