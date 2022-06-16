// Tests the votes functionality
//  to run: run this in the terminal => npx hardhat test test/votes.js
const { expect } = require("chai");
const {deployments} = require('hardhat');

// const artifact = await deployments.getArtifact(artifactName);
describe("Stv Factory Contract", function () {
  let signer;




  it("votes on a ballot in the deployed Stv contract", async function () {
    signer = await ethers.getSigners();
    const artifact = await deployments.getArtifact("Stv");
    const hardhatStv     = new ethers.Contract("0x3C101c4a2FADbdfF7Db9A138C92DC303f6B18E64", artifact.abi, signer[0])

  
    let user_one_vote   = [1,3,2,4];
    let user_two_vote   = [4,2,3,1];
    let user_three_vote = [3,4,2,1];
    let user_four_vote  = [1,3,4,2];
    
    let users_vote = [user_one_vote, user_two_vote, user_three_vote, user_four_vote];
    let users_prefered_proposal;

    
    
    // vote 
    for (let start = 0; start < users_vote.length; start++) {
        for (let i= 0; i < users_vote[start].length; i++) {
            if (users_vote[start][i] == 1) {
                users_prefered_proposal = i;
            }
        }

            let vote = await hardhatStv.vote(users_prefered_proposal, users_vote[start]);
            // events emitted
            let receipt = await vote.wait() 
            
            console.log(`${receipt.events[0].args[0]}; this were your preference ${receipt.events[0].args[1]};`)
    }
  });

});