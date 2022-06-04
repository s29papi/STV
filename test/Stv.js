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
    // deploy STVFactory Contract
    const STVFactory        = await ethers.getContractFactory("STVFactory"); 
    const hardhatSTVFactory = await STVFactory.deploy();
    await hardhatSTVFactory.deployed();
    
    // STV Contract deploy params
    const ElectionName       = "Vote for Budget";
    const ElectionDate       =  90; // dummy
    const ElectionDuration   =  92; // dummy
 
    // deploy the Stv contract
    const deploy = await hardhatSTVFactory.deploy(ElectionName, ElectionDate, ElectionDuration)
    const receipt = await deploy.wait()
    Stv_address = receipt.events[0].args[0];
    console.log("Deployed Stv address:",receipt.events[0].args[0])
  });

  it("Tests and verifies the constructor args were assigned rightly", async function () {
    // constructor args were assigned to the following StateVariables
    // ElectionName
    // ElectionDate
    // ElectionDuration
    const   Stv                  = await ethers.getContractFactory("Stv");
    const   hardhatStv           = await Stv.attach(Stv_address);
    const   ElectionName         = await hardhatStv.viewElectionName();
    const   ElectionDate         = await hardhatStv.viewElectionDate();
    const   ElectionDuration     = await hardhatStv.viewElectionDuration();
    // log to stout
    console.log(`The Election Name is ${ElectionName}`)
    console.log(`The Election Date is ${ElectionDate}`)
    console.log(`The Election Duration is ${ElectionDuration}`)
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
    // passElectionProposals(bytes32[] memory _electionProposals) 
    // Takes in args of proposals or candidates or representative
    // Which would be competing for votes to be voted on
    // proposals or candidates or representative
    let proposal_one    = ethers.utils.formatBytes32String("Budget A: $50000")
    let proposal_two    = ethers.utils.formatBytes32String("Budget B: $25000")
    let proposal_three  = ethers.utils.formatBytes32String("Budget B: $15000")
    let proposal_four   = ethers.utils.formatBytes32String("Budget B: $500")
    let proposal_five   = ethers.utils.formatBytes32String("Budget B: $25500")
    let proposal_six    = ethers.utils.formatBytes32String("Budget B: $9500")
    let proposal_seven  = ethers.utils.formatBytes32String("Budget B: $34500")
    let proposal_eight  = ethers.utils.formatBytes32String("Budget B: $2509000")
    let proposal_nine   = ethers.utils.formatBytes32String("Budget B: $200")
    proposals           = [proposal_one, proposal_two, proposal_three, proposal_four, proposal_five, proposal_six, proposal_seven, proposal_eight, proposal_nine]

    await   hardhatStv.passElectionProposals(proposals) ;
  });

  it("view election proposals after passing proposals", async function () {
    const   Stv                 =  await   ethers.getContractFactory("Stv");
    const   hardhatStv          =  await   Stv.attach(Stv_address);
    const   ElectionProposals   =  await   hardhatStv.viewElectionProposals();
    for     (let   start = 0;   start   <   ElectionProposals.length;   start++)       {
             let   originalText    = ethers.utils.parseBytes32String(ElectionProposals[start]);
             console.log(`Election proposals ${start}.) ${originalText}`)
    }
  });

  it("creates a ballot with the Stv contract", async function () {
    const   Stv             = await ethers.getContractFactory("Stv");
    const   hardhatStv      = await Stv.attach(Stv_address);
    // createBallot()
    // calls _createBallot(), which Takes in args of proposals or candidates or representative
    // Which would be competing for votes to be voted on
    // proposals or candidates or representative
    const createBallot = await   hardhatStv.createBallot();
    const receipt      = await   createBallot.wait();
    console.log(`createBallot(...) event_1: ${receipt.events[0].args[0]}, event_2: ${receipt.events[0].args[1]}`)
  });


  // proper way too test would be commenting out passing of proposals
  // this should make creating a ballot fail
  // A ballot can only be created if a ballot hasn't been previously created
  // and the election proposals have passed
  it("checks if ballot is created, and proposals have passed", async function () {
    const   Stv             = await ethers.getContractFactory("Stv");
    const   hardhatStv      = await Stv.attach(Stv_address);

    const   isBallotCreated = await hardhatStv.viewIsBallotCreated()
    if      (isBallotCreated)  {  console.log("Ballot has been created")  }

    const   IsElectionProposalsPassed = await hardhatStv.viewIsElectionProposalsPassed
    if      (IsElectionProposalsPassed)  {  console.log("Election proposal have passed")  }
    // call again to confirm ballot can only be created once
    // await hardhatStv.createBallot(); 
  });

  it("votes on a ballot in the deployed Stv contract", async function () {
    const   Stv             = await ethers.getContractFactory("Stv");
    const   hardhatStv      = await Stv.attach(Stv_address);
    // users vote by preference
    let user_one_vote   = [4,3,2,1,5,7,8,6,9];
    let user_two_vote   = [1,2,3,4,6,5,9,8,7];
    let user_three_vote = [3,1,4,2,8,7,5,6,9];
    let user_four_vote  = [2,1,3,4,9,8,5,6,7];
    //  
    let users_vote = [user_one_vote, user_two_vote, user_three_vote, user_four_vote]
    // vote 
    for (let start = 0; start < users_vote.length; start++) {
            let vote = await hardhatStv.vote(users_vote[start]);
            // events emitted
            let receipt = await vote.wait() 
            console.log(`${receipt.events[0].args[0]}; this were your preference ${receipt.events[0].args[1]};`)
    }
  });

 // comment out the code to test
  it("should fail, because wrong voting args were passed", async function () {
    // const   Stv             = await ethers.getContractFactory("Stv");
    // const   hardhatStv      = await Stv.attach(Stv_address);
    
    //  // this votes should 
    // // preferable to test each seperately as the first would revert and not give
    // // chance for the others to be evaluated
    // let user_Test_vote1 = [4,0,2,1]; // should fail if users votes preference of zero
    // let user_Test_vote2 = [4,3,6,1]; // should fail if users votes preference above the no of proposal or representatives
    // let user_Test_vote3 = [4,3,6,1,0]; // should fail if users votes preference above the no of proposal or representatives
    // let user_Test_vote3 = [4,3,6]; // should fail if users votes preference above the no of proposal or representatives
    
    // let unsuccessful_votes = [ user_Test_vote2, user_Test_vote1] 
    // for (let start = 0; start < unsuccessful_votes.length; start++) {
    //   let vote = await hardhatStv.vote(unsuccessful_votes[start]);
    //   // events emitted
    //   let receipt = await vote.wait() 
    //   console.log(`${receipt.events[0].args[0]}; this were your preference ${receipt.events[0].args[1]};`)
    // }
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
    // validates if a proposal is above the proposal threshold
    for (let start = 0; start < proposals.length; start++) {
            let   isAboveThreshold   = await hardhatStv.isProposalAboveThreshold(start)
            let   originalText    = ethers.utils.parseBytes32String(proposals[start]);
             console.log(`Ballot Proposal ${start}. ${originalText} isAboveThreshold: ${isAboveThreshold}`)
    }
  });
});

