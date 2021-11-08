import Web3 from 'web3';
import NftMarket from './contracts/NftMarket.json'; // change to NftMarket
import NftContract from './contracts/Nft.json';
import tokenContract from './contracts/DanToken.json';

let web3
let networkId
let ERC20Symbol
let ERC721Symbol
let NftMarketInstance;
let NftContractInstance;
let tokenContractInstance;

export const initContracts = async () => {
	web3 = new Web3(window.ethereum || 'http://localhost:9545');

	networkId = await web3.eth.net.getId();

	NftMarketInstance = await new web3.eth.Contract(
		NftMarket.abi,
		NftMarket.networks[networkId].address
	);
	NftContractInstance = await new web3.eth.Contract(
		NftContract.abi,
		NftContract.networks[networkId].address
	);
	tokenContractInstance = await new web3.eth.Contract(
		tokenContract.abi,
		tokenContract.networks[networkId].address
	);
	ERC20Symbol = await tokenContractInstance.methods
		.symbol().call()
	ERC721Symbol = await NftContractInstance.methods
		.symbol().call()

	return true
}

export const getPastTxns = async (itemId) => {
	let data = await NftMarketInstance.getPastEvents(
		"Transfer", {
		filter: { _tokenId: itemId },
		fromBlock: 0,
		toBlock: 'latest'
	}, () => { })
	return data.reduceRight((acc, curr) => {
		let price = curr.returnValues._price
		curr.returnValues._price = web3.utils.fromWei(price, "ether") + " " + ERC20Symbol
		return acc.concat(curr.returnValues)
	}, [])

}


export const initWallet = async () => {
	let provider = window.ethereum;

	if (typeof provider !== 'undefined') {
		await provider.request({ method: 'eth_requestAccounts' })

	}
};
export const getOwnBalance = async () => {
	const bal = await tokenContractInstance.methods
		.balanceOf(window.ethereum.selectedAddress)
		.call()

	return web3.utils.fromWei(bal, "ether") + " " + ERC20Symbol
};

export const getNftBalance = async () => {
	const bal = await NftContractInstance.methods
		.balanceOf(window.ethereum.selectedAddress)
		.call()
	return bal + " " + ERC721Symbol
};

export const getNftList = async () => {
	const list = await NftMarketInstance.methods
		.fetchMarketItems()
		.call()
	return Promise.all(list.slice(0).reverse().map(async (item) => {
		const obj = Object.assign({}, item)
		obj["price"] = web3.utils.fromWei(obj.price, "ether")
		obj["symbol"] = ERC20Symbol
		obj["url"] = await NftContractInstance.methods.tokenURI(item.tokenId).call()
		return obj
	}))
};

export const getUserNfts = async () => {
	const list = await NftMarketInstance.methods
		.fetchMyNFTs()
		.call({ from: window.ethereum.selectedAddress })
	return Promise.all(list.slice(0).reverse().map(async (item) => {
		const obj = Object.assign({}, item)
		obj["price"] = web3.utils.fromWei(obj.price, "ether")
		obj["symbol"] = ERC20Symbol
		obj["url"] = await NftContractInstance.methods.tokenURI(item.tokenId).call()
		return obj
	}))
};

export const createNft = async (_url, _price) => {
	let gasAmount
	gasAmount = await NftContractInstance.methods
		.createToken(_url)
		.estimateGas({ from: window.ethereum.selectedAddress })

	let { events } = await NftContractInstance.methods
		.createToken(_url)
		.send({
			from: window.ethereum.selectedAddress,
			gas: gasAmount
		})
	let tokenId = events["Transfer"].returnValues.tokenId
	const nftAddress = String(NftContract.networks[networkId].address)
	const weiPrice = web3.utils.toWei(_price, 'ether');

	gasAmount = await NftMarketInstance.methods
		.createMarketItem(nftAddress, tokenId, weiPrice, true)
		.estimateGas({ from: window.ethereum.selectedAddress })
	return NftMarketInstance.methods
		.createMarketItem(nftAddress, tokenId, weiPrice, true)
		.send({
			from: window.ethereum.selectedAddress,
			gas: gasAmount
		})
};

export const buyNft = async ({ _itemId, _price }) => {
	const nftAddress = String(NftContract.networks[networkId].address)
	const nftMarket = String(NftMarket.networks[networkId].address)
	const tokenAddress = String(tokenContract.networks[networkId].address)
	const weiPrice = web3.utils.toWei(_price, 'ether');
	await tokenContractInstance.methods
		.approve(nftMarket, weiPrice)
		.send({ from: window.ethereum.selectedAddress })
	let gasAmount = await NftMarketInstance.methods
		.createMarketSale(nftAddress, tokenAddress, _itemId)
		.estimateGas({ from: window.ethereum.selectedAddress })
	return NftMarketInstance.methods
		.createMarketSale(nftAddress, tokenAddress, _itemId)
		.send({ from: window.ethereum.selectedAddress, gas: gasAmount })
};

export const mintToken = async (amount) => {
	const val = web3.utils.toWei(amount, 'ether')
	return tokenContractInstance.methods
		.mint(window.ethereum.selectedAddress, val)
		.send({
			from: window.ethereum.selectedAddress,
			value: val
		})
}


export const updateNftStatus = async (itemId, status) => {
	const nftAddress = String(NftContract.networks[networkId].address)
	let gasAmount = await NftMarketInstance.methods
		.updateNftStatus(itemId, status, nftAddress)
		.estimateGas({ from: window.ethereum.selectedAddress })
	return NftMarketInstance.methods
		.updateNftStatus(itemId, status, nftAddress)
		.send({
			from: window.ethereum.selectedAddress,
			gas: gasAmount,
		})
}


export const updateNftPrice = async (itemId, price) => {
	const val = web3.utils.toWei(price, 'ether')
	return NftMarketInstance.methods
		.updatePrice(itemId, val)
		.send({
			from: window.ethereum.selectedAddress
		})
}

