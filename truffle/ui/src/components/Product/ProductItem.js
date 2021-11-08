import './ProductItem.css'
import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { FaSpinner } from 'react-icons/fa';
import { buyNft, getPastTxns } from '../../web3Config'
function ProductItem(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [modalData, setModalData] = useState([])
    const purchaseHandler = async (productInfo) => {
        setIsLoading(true)
        await buyNft(productInfo)
        setIsLoading(false)

    }

    const fetchInfo = async (itemId) => {
        const data = await getPastTxns(itemId)
        setModalData(data)
    }


    let productInfo = { _itemId: props.itemId, _price: props.price }

    return (
        <div className="card-container">
            <span className="pro">{props.price + props.symbol}</span>
            <img className="round" src={props.url} alt={props.itemId} />
            <h3></h3>
            {/* <h6>New York</h6>
            <p>User interface designer and <br /> front-end developer</p> */}
            <div className="buttons">
                <button className="primary" onClick={() => purchaseHandler(productInfo)}>
                    {isLoading ? <FaSpinner icon="spinner" className="spinner" /> : "Buy"}
                </button>
                <Popup className="my-popup-content" onOpen={() => fetchInfo(props.itemId)} trigger={<button className="primary ghost">Info</button>} position="right center">
                    {modalData.length ? <table>
                        <thead>
                            <tr>
                                <th>From </th>
                                <th>To</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modalData.map((e, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{e["_from"]}</td>
                                        <td>{e["_to"]}</td>
                                        <td className="item-price">{e["_price"]}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table> : <div className="item-price">Newly Minted Token</div>}
                </Popup>
            </div>
        </div>
    )


}

export default ProductItem