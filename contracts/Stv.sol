
pragma solidity ^0.7.0;
import "hardhat/console.sol";



contract Stv {   
    event    BallotCreated (string voteName, uint256 noProposalOrRepresentatives);
    event    UserSuccessfullyVoted (string success, uint256[] preference);


    // check if a vote is valid that is
    // a) the votes do not exceed or are below the no of proposals
    // b) there was no proposal ranked as zero
    // c) To-Do => there is no repeated ranks
    modifier isVoteValid(uint256[] calldata preferenceRank)   {
                    uint  NoOfProposals   =   Ballot[preferenceRank.length - 1][TotalNoOfProposal];
                    require(preferenceRank.length == NoOfProposals, "Vote is below or exceeds the number of proposals");
                    for (uint8 start  = 0; start  < preferenceRank.length; start++)    {
                        if (preferenceRank[start] > NoOfProposals)            {
                                    revert("Rank cannot be higher than number of representative or proposals");
                        }
                        if (preferenceRank[start] == 0)            {
                                    revert("Rank cannot be equal to zero");
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

    // used in proposal threshold function,
    // in a multivote election the winners are usually more than one representatives 
    // or proposals. TotalNoOfAvailableSlots is the number of this winners.
    uint          immutable public   TotalNoOfAvailableSlots;

    // used in the mapping ballot to store and retrieve the total number of proposals   
    bytes32       constant  public   TotalNoOfProposal  =  "Total No Of Proposal";

    // => Perfect Candidate information
    
    // A perfect Candidate is the same as a perfect representative or proposal,
    // it is non existent as it is used to only track 
    // a) what a pefect score / vote would have looked like if a candidate was selected
    //    as the prefered candidate by everyone
    // b) gives information also about how many votes came in. i.e PerfectCandidateTotalVote / 100 %
    uint16        constant  public   PerfectCandidateID   = 1000;
    bytes32       constant  public   PerfectCandidateNAME = "Perfect_Candidate_NAME";
    
    bool                    public   isBallotCreated;
    bool                    public   isElectionProposalsPassed;



    // think of it as the Ballot Paper;
    //   Proposal number   |      Proposal Name       | Cummulated votes (Vote by weight if 1 100%, if 2 50% ...)
    // ---------------------------------------------------------------------------------------------------
    //          0          |                          |                                    
    //          1          |                          |           
    //          2          |                          |
    //          .          |                          |      
    //          .          |                          |      
    //          .          |                          |      
    //          n          |  "Total No Of Proposal"  | Cummulated No of Proposal     
    // PerfectCandidateID  |   PerfectCandidateNAME   | Cummulated Votes of an imaginery Perfect Candidate    
    mapping (uint256  =>   mapping(bytes32 => uint256))          public Ballot;

    // might remove the struct above for this, this helps track a voters alternative choice
    // e.g what percentage of people voted this proposal as second choice
    // think of it as each proposal information
    // Proposal Name    | Preference number   |  Total or cummulative % of votes gotten for each preference
    // -----------------------------------------------------------------------------------------------------
    // Proposal_Name_1  |         1           |  Total or cummulative % of votes gotten for preference 1                
    // Proposal_Name_1  |         2           |  Total or cummulative % of votes gotten for preference 2                                              
    mapping (bytes32   =>   mapping(uint256 => uint256))         public Proposal;



    constructor(string memory _electionName, uint _electionDate, uint _electionDuration, uint _totalNoOfAvailableSlots) {
                ElectionName            = _electionName; 
                ElectionDate            = _electionDate;
                ElectionDuration        = _electionDuration;
                TotalNoOfAvailableSlots = _totalNoOfAvailableSlots;
    }

    function    viewElectionProposals()        public view returns (bytes32[] memory)    {
                if (!isElectionProposalsPassed) {
                     revert("Election Proposal has not been passed");
                }
                return ElectionProposals;
    }

    function    passElectionProposals(bytes32[] memory _electionProposals)   external    {
                if (isElectionProposalsPassed) {
                     revert("Election Proposal has been passed");
                } else { 
                     ElectionProposals         =  _electionProposals; 
                     isElectionProposalsPassed =  true;
                }
    }
    // create a ballot with the list of proposal or representatives provided in the Array,
    // And a Perfect Candidates information.
    function     _createBallot(bytes32[] memory _proposalOrRepresentatives)        private             {
                require(!isBallotCreated, "Ballot has already been created");
                require(isElectionProposalsPassed, "Proposals have to be passed first");

                for (uint8 start  = 0; start < _proposalOrRepresentatives.length; start++)    {
                        Ballot[start][_proposalOrRepresentatives[start]] = 0;
                }
                Ballot[_proposalOrRepresentatives.length - 1][TotalNoOfProposal] = _proposalOrRepresentatives.length;
                Ballot[PerfectCandidateID][PerfectCandidateNAME] = 0;

                emit    BallotCreated(ElectionName, _proposalOrRepresentatives.length);
    }
    // create a ballot with the list of of proposal or representatives provided in the Array.
    function     createBallot()                                                    external            {
                 _createBallot(ElectionProposals);
                 isBallotCreated = true;
    }

    function    viewIsBallotCreated()                            public view returns (bool)            {
                return isBallotCreated;
    }

    function    viewIsElectionProposalsPassed()                  public view returns (bool)            {
                return isElectionProposalsPassed;
    }

    // To get total ballot count on or for each proposal loop round getProposalCount(uint8 _proposalNo) 
    // by the number of proposals.
    function     getProposalCount(uint8 _proposalNo)   public      view      returns (uint256)         {
                 uint256 numerator   = Ballot[_proposalNo][ElectionProposals[_proposalNo]] * 100 * 10 ** 18;
                 uint256 denominator = Ballot[PerfectCandidateID][PerfectCandidateNAME];
                 return  numerator / denominator;
    }

    function     ProposalThreshold()                   public      view      returns (uint256)         {
                 uint256   numerator   =  100 * 10 ** 18;
                 uint256   denominator =  TotalNoOfAvailableSlots;
                 return    numerator   /  denominator;
    }

    // To-Do modify this function to only be called after votes are done
    // Revisit tomorrow
    function     isProposalAboveThreshold(uint8 _proposalNo) public      view      returns (bool)         {    
                if (getProposalCount(_proposalNo) >=  ProposalThreshold()) {
                         return true;
                } else {
                         return false;  
                }         
    }

    // To-do: only a valid user can call vote, and only once can he call vote 
    function     vote(uint256[] calldata preferenceRank) external    isVoteValid(preferenceRank)    {
                     uint256 NoOfProposals = ElectionProposals.length;
                     uint256 numerator;
                     uint256 denominator;
                     // Explaining the calculation
                     // There are no decimals or floats in solidity
                     // so for precision we multiply by 10 ** 18
                     // users votes are added based on the example below
                     // using arbitrary preferences as the denominators
                     // (100 * 10 ** 18) / 2   +   (100 * 10 ** 18)/ 3  + ...  + (100 * 10 ** 18)/4
                     // when getProposalCount(uint8 _proposalNo) is called
                     // we divide the total votes above by the Perfect candidates vote (as specified below)
                     // and we multiply by 100 * 10 ** 18 (to represent the percentage)
                     for (uint8 start  = 0; start < NoOfProposals; start++)    {
                            numerator = 100 * 10 ** 18;
                            denominator = preferenceRank[start];
                            Ballot[start][ElectionProposals[start]] += numerator / denominator;
                            // tracks the vote on particular proposal
                            // to help us know how many people voted this as their
                            // first, second or prefered choice, this should help us in transfering votes
                            // To-Continue tommorow
                            Proposal[ElectionProposals[start]][preferenceRank[start]]  += numerator / denominator;
                     }
                            // A perfect candidate is one who recieved a preference of 100 on each vote
                            // It is imagenary, it is not a real representative or candidate but we
                            // use it to track for the following
                            // a) the total number of people that voted, which you would arrive at if 
                            //    you divide it by 100 * 10 ** 18
                            // b) we use it to weight the total users vote, to know how a candidate or proposal.
                            //    performed
                            Ballot[PerfectCandidateID][PerfectCandidateNAME] += 100 * 10 ** 18;
             
                    emit    UserSuccessfullyVoted("You've successfully voted", preferenceRank);
    }  



    







}