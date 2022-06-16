// run: npx hardhat run script/deploy.js --network polygon_mumbai
async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const STVFactory        = await ethers.getContractFactory("STVFactory"); 
    const hardhatSTVFactory = await STVFactory.deploy();
    await hardhatSTVFactory.deployed();
  
    console.log("STV Factory address:", hardhatSTVFactory.address);
  }
   
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });