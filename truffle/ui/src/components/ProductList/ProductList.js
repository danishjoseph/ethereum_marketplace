
import { useEffect, useState } from 'react'
import ProductItem from '../Product/ProductItem'
import { getNftList } from '../../web3Config'
import './ProductList.css'
function ProductList() {
    const [itemList, setItemList] = useState([])

    useEffect(() => {
        const getMarketItems = async () => {
            let list = await getNftList()
            setItemList(list)
        }
        getMarketItems()
    }, [])

    if (!itemList.length)
        return (<div style={{ textAlign: 'center' }}><h3> No items..</h3></div>)
    else
        return (
            <div className="item-list">
                {itemList.map((e) => {
                    return <ProductItem className="item" 
                    key={e.itemId}
                    itemId = {e.itemId}
                    owner={e.owner} 
                    url={e.url} 
                    price={e.price}
                    symbol={e.symbol} />
                })}
            </div>

        )
}

export default ProductList