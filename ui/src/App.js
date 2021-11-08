import NavBar from './components/Navigation/NavBar';
import ProductList from './components/ProductList/ProductList';
import AuthContext from './store/auth-context';
import './App.css';
import { useState, useEffect } from 'react';
import { initContracts, initWallet } from './web3Config'
import Profile from './components/Profile/Profile';

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [account, setAccount] = useState('')
  const [showHome, setHome] = useState(false)
  const [showProfile, setProfile] = useState(false)



  useEffect(() => {
    const init = async () => {
      await initContracts()
      setHome(true)
    }
    init()
  }, [])

  const logoutHandler = () => {
    setLoggedIn(false)
  }

  const walletHandler = async () => {
    await initWallet();
    setLoggedIn(true)
    setAccount(window.ethereum.selectedAddress)
  }

  window.ethereum.on('accountsChanged', function (accounts) {
    if (!window.ethereum.selectedAddress) {
      setLoggedIn(false)
    }
    else {
      setAccount(accounts[0])
    }
  });

  const homeHandler = () => {
    if(showProfile) 
      setProfile(false)
    setHome(true)

  }

  const profileHandler = () => {
    setProfile(!showProfile)
    setHome(!showHome)
  }


  return (
    <AuthContext.Provider value={
      { isLoggedIn: isLoggedIn,
        currentAccount : window.ethereum.selectedAddress
       }
    }>
      <NavBar onLogout={logoutHandler} connectWallet={walletHandler} showHome={homeHandler} showProfile={profileHandler} accountAddress={account} />
      {showHome && <ProductList />}
      {showProfile && <Profile />}
    </AuthContext.Provider>
  );
}

export default App;
