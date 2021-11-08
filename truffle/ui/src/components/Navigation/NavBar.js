import './NavBar.css'
import { useContext } from 'react'
import { FaUser } from "react-icons/fa"
import AuthContext from '../../store/auth-context'
function NavBar(props) {
    const ctx = useContext(AuthContext)
    return (
        <nav>
            <a className='title-link' onClick={props.showHome}><h1 className="title">NFT MARKETPLACE</h1></a>
            <ul className="nav-links">
                {!ctx.isLoggedIn && <li><a onClick={props.connectWallet}>Connect to Wallet</a></li>}
                {ctx.isLoggedIn && <li><a><FaUser onClick={props.showProfile}/></a></li>}
                {ctx.isLoggedIn && <li><a onClick={props.onLogout}>Logout</a></li>}
            </ul>
        </nav>
    )

}
export default NavBar