
pragma solidity ^0.7.0;



contract Stv {   
    event BallotCreated(string voteName, uint8 noOfProposals);

    string         public VoteName;
    bool           public isBallotCreated;

    uint immutable public Date;
    uint immutable public Duration;
    

    // Proposal == representative
    struct Proposal {
           bytes32 name;
    }

    Proposal[] public Proposals;

    mapping(uint8 => bytes32) public Ballot;

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

    function     _createBallot()               private                            {
                require(!isBallotCreated, "Ballot has already been created");
                uint8 noOfProposals;
                for (uint8 start  = 0; start < Proposals.length; start++)    {
                        Ballot[start] = Proposals[start].name;
                        noOfProposals += 1;
                }
                emit    BallotCreated(VoteName, noOfProposals);
    }

    function     createBallot()                 external                           {
                 _createBallot();
                 isBallotCreated = true;
    }
    // comment out vote function and you can run a test
    function     vote(uint8[] preferenceRank) external                             {
                 if  (isVoteValid(preferenceRank)) {
                  // would continue in the morning
                 };
             
    }  

    function isVoteValid(uint8[] preferenceRank)    public    returns    (bool)    {
                require(preferenceRank.length == Proposals.length, "Vote exceeds the number of proposals");
                for (uint8 start  = 0; start  < preferenceRank.length; start++)    {
                    if (preferenceRank[start] > Proposals.length)            {
                                  return false;
                    }
                }
                return true;
    } 

    







}