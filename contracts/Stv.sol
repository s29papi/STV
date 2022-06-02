
pragma solidity ^0.7.0;
import "hardhat/console.sol";


contract Stv {   
    event    BallotCreated (string voteName, uint8 noOfProposals);
    event    UserSuccessfullyVoted (string success, uint256[] preference);

    modifier isVoteValid(uint256[] calldata preferenceRank)   {
                    require(preferenceRank.length == Proposals.length, "Vote exceeds the number of proposals");
                    for (uint8 start  = 0; start  < preferenceRank.length; start++)    {
                        if (preferenceRank[start] > Proposals.length)            {
                                    revert("Rank cannot be higher than number of representative");
                        }
                        if (preferenceRank[start] == 0)            {
                                    revert("Rank cannot be equal to zero");
                        }
                    }
                    _;
    } 

    // Proposal == representative
    // might remove this
    struct Proposal {
           bytes32 name;
    }

    string         public  VoteName;
    bool           public  isBallotCreated;
    uint immutable public  Date;
    uint immutable public  Duration;
    Proposal[ ]    public  Proposals;



    // think of it as the Ballot Paper;
    mapping (uint8 => mapping(bytes32 => uint256))     public Ballot;

    // might remove the struct above for this, this helps track a voters alternative choice
    // e.g what percentage of people voted this proposal as second choice
    mapping (uint8 => mapping(bytes32 => uint256))     public _Proposal;



    constructor(string memory _voteName, uint _date, uint _duration, bytes32[] memory _proposalNames) {
                VoteName  = _voteName; 
                Date      = _date;
                Duration  = _duration;
                for (uint8 start  = 0; start < _proposalNames.length; start++)    {
                        Proposals.push(Proposal({
                            name: _proposalNames[start]
                        }));
                }
    }

    function     _createBallot()                       private                            {
                require(!isBallotCreated, "Ballot has already been created");
                uint8 noOfProposals;
                for (uint8 start  = 0; start < Proposals.length; start++)    {
                        Ballot[start][Proposals[start].name] = 0;
                        noOfProposals += 1;
                }
                
                emit    BallotCreated(VoteName, noOfProposals);
    }

    function     createBallot()                        external                                        {
                 _createBallot();
                 isBallotCreated = true;
    }
    // To get total ballot count loop round getProposalCount(uint8 _proposalNo) by the number of proposals.
    
    function     getProposalCount(uint8 _proposalNo)   public      view      returns (uint256)         {
                 uint256 numerator = Ballot[_proposalNo][Proposals[_proposalNo].name] * 10 ** 18;
                 uint256 denominator = Ballot[6]["Perfect_Vote"];
                 return  numerator / denominator;
    }

    function     ProposalThreshold()                   public      view      returns (uint256)         {
                 uint256   numerator   =  100 * 10 ** 18;
                 uint256   denominator =  Proposals.length * 100;
                 return    numerator   /  denominator;
    }

    // To-Do modify this function to only be called after votes are done
    function     isProposalAboveThreshold(uint8 _proposalNo) public      view      returns (bool)         {    
                if (getProposalCount(_proposalNo) >=  ProposalThreshold()) {
                         return true;
                } else {
                         return false;  
                }         
    }

    // To-do: only a valid user can call vote, and only once can he call vote
    function     vote(uint256[] calldata preferenceRank) external  isVoteValid(preferenceRank)         {
                        uint256 numerator;
                        uint256 denominator;
                 for (uint8 start  = 0; start < Proposals.length; start++)    {
                        numerator = 100 * 10 ** 18;
                        denominator = preferenceRank[start];
                        Ballot[start][Proposals[start].name] += numerator / denominator;
                 }
                        Ballot[6]["Perfect_Vote"] += 100 * 10 ** 18;

                 emit UserSuccessfullyVoted("You've successfully voted", preferenceRank);
    }  



    







}