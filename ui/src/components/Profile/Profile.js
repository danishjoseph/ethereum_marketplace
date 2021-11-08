import React, { useState, useEffect } from "react"
import Register from '../Register/Register';
import './Profile.css'
import {
    getUserNfts, createNft, getOwnBalance,
    getNftBalance, mintToken
} from '../../web3Config'
import UserItem from "../UserItem/UserItem";

function Profile() {
    const [itemList, setItemList] = useState([])
    const [balance, setBalance] = useState({ erc20: "", nft: "" })
    const [showProfile, setProfile] = useState(true)
    const [showItems, setItems] = useState(false)
    const [showRegisterPage, setShowRegisterPage] = useState(false)
    const getBalance = async () => {
        let ERC20bal = await getOwnBalance()
        let ERC721bal = await getNftBalance()
        setBalance({ erc20: ERC20bal, nft: ERC721bal })
    }

    useEffect(() => {
        getBalance()
    }, [window.ethereum.selectedAddress])

    const profileHandler = () => {
        return (
            <div style={{ margin: "0 100px", maxWidth: "800px" }}>
                <h4>Account Address : <span className="item-pricee">{window.ethereum.selectedAddress}</span></h4>
                <h4>ERC20 Balance : <span className="item-price">{balance.erc20}</span></h4>
            </div>
        )
    }

    const updateHandler = async() => {
        let list = await getUserNfts()
        setItemList(list)
        getBalance()
    }


    const listHandler = () => {
        if (!itemList.length)
            return (<div style={{ textAlign: 'center' }}><h3> No items..</h3></div>)
        else {
            return (
                <div className="user-item-list">
                    {itemList.map((e) => {
                        return <UserItem className="item"
                            key={e.itemId}
                            itemId={e.itemId}
                            name={e.name}
                            url={e.url}
                            price={e.price}
                            status={e.status}
                            onUpdateChild={updateHandler}/>
                    })}
                </div>
            )
        }

    }

    const newERC721TokenHandler = async (url, price) => {
        await createNft(url, price);
        onUserList()
    }

    const newERC20TokenHandler = async (amount) => {
        await mintToken(amount);
        getBalance()
    }

    const registerHandler = () => {
        return (
            <React.Fragment>
                <Register title="Mint ERC20 Token" formType="ERC20" onMint={newERC20TokenHandler} />
                <Register title="Mint NFT Token" formType="ERC721" onRegister={newERC721TokenHandler} />
            </React.Fragment>

        )
    }

    const onProfile = () => {
        setItems(false)
        setProfile(true)
        setShowRegisterPage(false)

    }

    const onNewToken = () => {
        setProfile(false)
        setItems(false)
        setShowRegisterPage(true)
    }


    const onUserList = async () => {
        let list = await getUserNfts()
        setItemList(list)
        setProfile(false)
        setShowRegisterPage(false)
        setItems(true)
    }

    return (
        <div className='user-profile-card'>
            <div className="sub-menu">
                <button onClick={onProfile}>Profile</button>
                <button onClick={onNewToken}>Mint Tokens</button>
                <button onClick={onUserList}>List Items</button>
            </div>
            {showProfile && profileHandler()}
            {showItems && listHandler()}
            {showRegisterPage && registerHandler()}
        </div>

    )
}

export default Profile