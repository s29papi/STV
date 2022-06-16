require("@nomiclabs/hardhat-waffle");
require('hardhat-deploy');
require('dotenv').config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const POLYGON_MUMBAI_PRIVATE_KEY = process.env.POLYGON_MUMBAI_PRIVATE_KEY;
module.exports = {
  solidity: "0.7.0",
  networks: {
    polygon_mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${POLYGON_MUMBAI_PRIVATE_KEY}`]
    }
  },
  mocha: {
    timeout: 10000000000
  }
};

