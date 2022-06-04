const { expect } = require("chai");
//  to run, run this in the terminal => npx hardhat test test/Stv.js

describe("Stv Factory Contract", function () {
  let owner;
  let user_one;
  let user_two;
  let user_three;
  let user_four;
  let Stv_address;
  let proposals;

  it("Deploys StvFactory and an Stv contract", async function () {
    [owner, user_one, user_two, user_three, user_four] = await ethers.getSigners();
    
    const STVFactory = await ethers.getContractFactory("STVFactory"); 
    const hardhatSTVFactory = await STVFactory.deploy();
    await hardhatSTVFactory.deployed();
    
    // deploy params
    const voteName   = "Vote for Budget";
    let proposal_one = ethers.utils.formatBytes32String("Budget A: $50000")
    let proposal_two = ethers.utils.formatBytes32String("Budget B: $25000")
    let proposal_three = ethers.utils.formatBytes32String("Budget B: $15000")
    let proposal_four = ethers.utils.formatBytes32String("Budget B: $2500")
    proposals        = [proposal_one, proposal_two, proposal_three, proposal_four]
    const date       =  90; // dummy
    const duration   =  92; // dummy
 
    // deploy an Stv contract
    const deploy = await hardhatSTVFactory.deploy(voteName, date, duration, proposals)
    const receipt = await deploy.wait()
    Stv_address = receipt.events[0].args[0];
    console.log("Deployed Stv address:",receipt.events[0].args[0])
  });

  it("creates a ballot with the deployed Stv contract", async function () {
    const   Stv             = await ethers.getContractFactory("Stv");
    const   hardhatStv      = await Stv.attach(Stv_address);
    await   hardhatStv.createBallot();
    const   isBallotCreated = await hardhatStv.isBallotCreated()
    if      (isBallotCreated)  {  console.log("Ballot has been created")  }
    // await hardhatStv.createBallot() // call again to confirm ballot can only be created once
  });

  it("votes on a ballot in the deployed Stv contract", async function () {
    const   Stv             = await ethers.getContractFactory("Stv");
    const   hardhatStv      = await Stv.attach(Stv_address);
    // users vote by preference
    let user_one_vote = [4,3,2,1];
    let user_two_vote = [1,2,3,4];
    let user_three_vote = [3,1,4,2];
    let user_four_vote = [2,1,3,4];
    //  
    let users_vote = [user_one_vote, user_two_vote, user_three_vote, user_four_vote]
    // vote 
    for (let start = 0; start < users_vote.length; start++) {
            let vote = await hardhatStv.vote(users_vote[start]);
            // events emitted
            let receipt = await vote.wait() 
            console.log(`${receipt.events[0].args[0]}; this were your preference ${receipt.events[0].args[1]};`)
    }

    // this votes should fail
    let user_Test_vote1 = [4,0,2,1]; // should fail if users votes preference of zero
    let user_Test_vote2 = [4,3,6,1]; // should fail if users votes preference above the no of proposal or representatives
    let unsuccessful_votes = [ user_Test_vote2, user_Test_vote1] 
    for (let start = 0; start < unsuccessful_votes.length; start++) {
      let vote = await hardhatStv.vote(unsuccessful_votes[start]);
      // events emitted
      let receipt = await vote.wait() 
      console.log(`${receipt.events[0].args[0]}; this were your preference ${receipt.events[0].args[1]};`)
    }
  });

  it("gets the Ballot count after the vote take place", async function () {
    const   Stv             = await ethers.getContractFactory("Stv");
    const   hardhatStv      = await Stv.attach(Stv_address);
    for (let start = 0; start < proposals.length; start++) {
            let   proposalCount   = await hardhatStv.getProposalCount(start)
            let   originalText    = ethers.utils.parseBytes32String(proposals[start]);
             console.log(`Ballot Proposal count ${start}. ${originalText} voteCount ${proposalCount}`)
    }
  }); 
      

  it("validates if a proposal is above the proposal threshold", async function () {
    const   Stv             = await ethers.getContractFactory("Stv");
    const   hardhatStv      = await Stv.attach(Stv_address);
    // check for proposal threshold
    let     Threshold       = await hardhatStv.ProposalThreshold()
    console.log(`Ballot Proposal Threshold: ${Threshold}`)
    for (let start = 0; start < proposals.length; start++) {
            let   isAboveThreshold   = await hardhatStv.isProposalAboveThreshold(start)
            let   originalText    = ethers.utils.parseBytes32String(proposals[start]);
             console.log(`Ballot Proposal ${start}. ${originalText} isAboveThreshold: ${isAboveThreshold}`)
    }
  });
});











