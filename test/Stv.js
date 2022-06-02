const { expect } = require("chai");
var bytes = require('bytes');

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
    proposals        = [proposal_one, proposal_two]
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
    for (let start = 0; start < proposals.length; start++) {
             const ballot_proposal = await hardhatStv.Ballot(start);
             let   originalText    = ethers.utils.parseBytes32String(ballot_proposal);
             console.log(`Ballot Proposal ${start}: ${originalText}`)
    }
    // await hardhatStv.createBallot() // call again to confirm ballot can only be created once
  });
});










