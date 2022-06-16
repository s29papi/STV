// Tests the votes functionality
//  to run: run this in the terminal => npx hardhat test test/vote.js
const { expect } = require("chai");
const {deployments} = require('hardhat');

// const artifact = await deployments.getArtifact(artifactName);
describe("Stv Factory Contract", function () {
  let signer;
  let user_one;
  let user_two;
  let user_three;
  let user_four;
  let Stv_address;
  let proposals;

  it("Calls Deploy on STV Factory contract to deploy a new STV Contract", async function () {
    signer = await ethers.getSigners();

    const artifact = await deployments.getArtifact("STVFactory");
    
    
    const STVFactory        = new ethers.Contract("0xe32435E76fC9A242a351591fFC28b66e3A386335", artifact.abi, signer[0])
 
    // STV Contract deploy params
    const ElectionName              = "Vote for Budget";
    const ElectionDate              =  90; // dummy
    const ElectionDuration          =  92; // dummy
    const TotalNoOfAvailableSlots   =  3; 
 
    // deploy the Stv contract
    const deploy = await STVFactory.deploy(ElectionName, ElectionDate, ElectionDuration, TotalNoOfAvailableSlots)
    const receipt = await deploy.wait()
    Stv_address = receipt.events[0].args[0];
    console.log("Deployed Stv address:",Stv_address)
  });

  it("Tests and verifies the constructor args were assigned rightly", async function () {
    // constructor args were assigned to the following StateVariables
    // ElectionName
    // ElectionDate
    // ElectionDuration
    const   Stv                         = await ethers.getContractFactory("Stv");
    const   hardhatStv                  = await Stv.attach(Stv_address);
    const   ElectionName                = await hardhatStv.ElectionName();
    const   ElectionDate                = await hardhatStv.ElectionDate();
    const   ElectionDuration            = await hardhatStv.ElectionDuration();
    const   TotalNoOfAvailableSlots     = await hardhatStv.TotalNoOfAvailableSlots();
    // log to stout
    console.log(`The Election Name is ${ElectionName}`)
    console.log(`The Election Date is ${ElectionDate}`)
    console.log(`The Election Duration is ${ElectionDuration}`)
    console.log(`The Total No Of Available Slots is ${ElectionDuration}`)
  });

  
  it("view election proposals before passing proposals", async function () {
    const   Stv             = await ethers.getContractFactory("Stv");
    const   hardhatStv      = await Stv.attach(Stv_address);
    // the call should revert as you cant view proposals unless they have been passed
    // uncomment the code to test
    // await   hardhatStv.viewElectionProposals();
  });

  it("passes election proposals", async function () {
    const   Stv             = await ethers.getContractFactory("Stv");
    const   hardhatStv      = await Stv.attach(Stv_address);
   
    let proposal_one    = ethers.utils.formatBytes32String("Budget A: $50000")
    let proposal_two    = ethers.utils.formatBytes32String("Budget B: $25000")
    let proposal_three  = ethers.utils.formatBytes32String("Budget B: $15000")
    let proposal_four   = ethers.utils.formatBytes32String("Budget B: $500")
    proposals           = [proposal_one, proposal_two, proposal_three, proposal_four]

    await   hardhatStv.passElectionProposals(proposals) ;
  });

  it("views election proposals after passing proposals", async function () {
    const   Stv                 =  await   ethers.getContractFactory("Stv");
    const   hardhatStv          =  await   Stv.attach(Stv_address);
    const   ElectionProposals   =  await   hardhatStv.viewElectionProposals();
    for     (let   start = 0;   start   <   ElectionProposals.length;   start++)       {
             let   originalText    = ethers.utils.parseBytes32String(ElectionProposals[start]);
             console.log(`Election proposals ${start}.) ${originalText}`)
    }
  });
});