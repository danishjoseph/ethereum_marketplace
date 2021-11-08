// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";



contract NftMarket is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;
  
  constructor() {
    
  }

  event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId, uint256 _price);


  struct MarketItem {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    bool status;
    address owner;
    uint256 price;
  }

  mapping(uint256 => MarketItem) private idToMarketItem;


  function getMarketItem(uint256 marketItemId) public view returns (MarketItem memory) {
    return idToMarketItem[marketItemId];
  }

  function createMarketItem(
    address nftContract,
    uint256 tokenId,
    uint256 price,
    bool status
  ) public nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    _itemIds.increment();
    uint256 itemId = _itemIds.current();
    idToMarketItem[itemId] =  MarketItem(
      itemId,
      nftContract,
      tokenId,
      status,
      msg.sender,
      price
    );

     IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);  

  }

  function createMarketSale(
    address nftContract,
    address tokenContract,
    uint256 itemId
    ) public nonReentrant {
    uint price = idToMarketItem[itemId].price;
    uint tokenId = idToMarketItem[itemId].tokenId;
    address owner = idToMarketItem[itemId].owner;
    require(IERC20(tokenContract).transferFrom(msg.sender,address(this),price),"Could not receive enough funds!");
    require(IERC20(tokenContract).transfer(owner,price),"Could not send funds to seller funds!");
    IERC721(nftContract).approve(msg.sender, tokenId);
    idToMarketItem[itemId].owner = msg.sender;
    _itemsSold.increment();
    emit Transfer(owner, msg.sender, tokenId, price);
  }

  function updatePrice(
    uint256 _itemId,
    uint256 _newPrice
  ) public nonReentrant {
    require(msg.sender == idToMarketItem[_itemId].owner,"Only owner allowed to modify");
     idToMarketItem[_itemId].price = _newPrice;
  }

  function updateNftStatus(
    uint256 _itemId,
    bool _status,
    address nftContract
  ) public nonReentrant {
    require(msg.sender == idToMarketItem[_itemId].owner,"Only owner allowed to modify");
    if(_status){
     IERC721(nftContract).transferFrom(msg.sender, address(this), _itemId);  
    }
    else {
      IERC721(nftContract).transferFrom(address(this),msg.sender, _itemId);  
    }
     idToMarketItem[_itemId].status = _status;
  }

  function fetchMarketItems() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].status) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].status) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
   
    return items;
  }

  function fetchMyNFTs() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
   
    return items;
  }
}