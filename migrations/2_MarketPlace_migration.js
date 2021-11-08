const MarketPlace = artifacts.require("NftMarket");
const NftContract = artifacts.require("Nft")
const DanContract = artifacts.require("DanToken")

module.exports = async function (deployer) {
  await deployer.deploy(MarketPlace);
  const MarketPlaceContractInstance = await MarketPlace.deployed();

  await deployer.deploy(NftContract,MarketPlaceContractInstance.address);
  
  await deployer.deploy(DanContract);

};
