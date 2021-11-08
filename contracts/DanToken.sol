// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DanToken is ERC20 {
    uint256 public balance = 0;
    address owner;
    constructor() ERC20("DanToken", "DAN") {
        owner = msg.sender; 
    }

    function mint(address to, uint256 amount) public payable {
        require(msg.value > 1, "Min 1 ether required");
        balance += msg.value;
        _mint(to, amount);
    }
    
}