// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;
import "hardhat/console.sol";



contract Stv { 
    event    UserSuccessfullyVoted (string success, uint256[] preference);

    // checks if a vote is valid that is:
    // a) the votes do not exceed or are below the number of proposals passed.
    // b) there was no proposal ranked as zero.
    // c) there is no repeated rank.
    modifier isVoteValid(uint256[] calldata preferenceRank)   {
               require(preferenceRank.length == ElectionProposals.length,
                                             "Vote is below or exceeds the number of proposals");
               uint256 rank = preferenceRank[0];
               for (uint8 start  = 0; start      < preferenceRank.length; start++)    {
                    if (preferenceRank[start]    > ElectionProposals.length)            {
                                   revert("Rank cannot be higher than number of representative or proposals");
                    }
                    if (preferenceRank[start]    <= 0)            {
                                   revert("Rank cannot be less than or equal to zero");
                    }
                    if (start     >      0      &&  preferenceRank[start] == rank)         {
                                   revert("Voted rank cannot be repeated");
                    }
               }
               _;
    } 

    // => Election information

    // Election name e.g presidential elections, company 3rd annual budget voting
    // Any name that accurately represents the election
    string                  public   ElectionName;
    uint          immutable public   ElectionDate;
    uint          immutable public   ElectionDuration;
    bytes32[]               private  ElectionProposals;
    bytes32[]               public   ElectionWinners;
    bool                    public   isElectionProposalsPassed;

    // used in proposal threshold function,
    // in a multivote election the winners are usually more than one representatives 
    // or proposals. TotalNoOfAvailableSlots is the number of this winners.
    uint256          immutable public   TotalNoOfAvailableSlots;

    
    uint256       constant  public   TotalVotesID   = 1000;
    
    
   
    
    mapping (uint256  =>   PreferedProposal)          public PreferedProposalCount;
    mapping (uint256  =>   bool) public isPreferedProposal;
    uint256[] public PreferedProposalNo;

    struct NextPreferedProposal {
         uint256[] proposalNo;
         mapping(uint256 => bool) isPartNextPreferedProposal;
         mapping(uint256 => uint256) proposalsWeight;
    }

    struct PreferedProposal {
         uint256 votedWeight;
         mapping(uint256 => NextPreferedProposal) votedPosition;
    }


    constructor(string memory _electionName, uint _electionDate, uint _electionDuration, uint _totalNoOfAvailableSlots) {
                ElectionName            = _electionName; 
                ElectionDate            = _electionDate;
                ElectionDuration        = _electionDuration;
                TotalNoOfAvailableSlots = _totalNoOfAvailableSlots;
    }

    function    viewElectionProposals()              public    view   returns (bytes32[] memory)    {
                if (!isElectionProposalsPassed) {
                     revert("Election Proposal has not been passed");
                }
                return ElectionProposals;
    }

    function    viewNoElectionProposals()            public    view   returns (uint256)            {
                if (!isElectionProposalsPassed) {
                     revert("Election Proposal has not been passed");
                }
                return ElectionProposals.length;
    }

    function    passElectionProposals(bytes32[] memory _electionProposals)     external            {
                if (isElectionProposalsPassed) {
                     revert("Election Proposal has been passed");
                } else { 
                     ElectionProposals         =  _electionProposals; 
                     isElectionProposalsPassed =  true;
                }
    }

    function    viewIsElectionProposalsPassed()      public   view   returns  (bool)               {
                return isElectionProposalsPassed;
    }


     
    function    getElectionQuota(string memory quotaName, uint256 votesCast, uint256 numberOfSlots) public pure returns (uint) {
                    
                    if (keccak256(abi.encodePacked((quotaName))) == keccak256(abi.encodePacked(("DROOP")))) {
                         return (votesCast / (numberOfSlots + 1)) + 1;
                         
                    }
                    if (keccak256(abi.encodePacked((quotaName))) == keccak256(abi.encodePacked(("HARE")))) {
                         return (votesCast / numberOfSlots);
                         
                    }
    }
    
    function     vote(uint256 preferedProposal, uint256[] calldata preferenceRank) external    isVoteValid(preferenceRank)    {
                    uint256 voteWeight = 1;

                    if (!isPreferedProposal[preferedProposal]) { 
                               PreferedProposalNo.push(preferedProposal);
                               isPreferedProposal[preferedProposal] = true;
                    }

                    PreferedProposalCount[preferedProposal].votedWeight += voteWeight;

                    for (uint256 start = 0; start < preferenceRank.length; start++) { 
                         if (preferedProposal == start) {
                              continue; 
                         }
                         if (!PreferedProposalCount[preferedProposal].votedPosition[preferenceRank[start]].isPartNextPreferedProposal[start]) { 
                                PreferedProposalCount[preferedProposal].votedPosition[preferenceRank[start]].proposalNo.push(start);
                                PreferedProposalCount[preferedProposal].votedPosition[preferenceRank[start]].isPartNextPreferedProposal[start] = true;
                         }
                         PreferedProposalCount[preferedProposal].votedPosition[preferenceRank[start]].proposalsWeight[start] += voteWeight;   
                    }

                    PreferedProposalCount[TotalVotesID].votedWeight += voteWeight;
                    
                         emit    UserSuccessfullyVoted("You've successfully voted", preferenceRank);
    }  

}