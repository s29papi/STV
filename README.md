# Single Transferable Vote (S.T.V)


Idea by @Klemen, used in the Encode Polygon Hackathon<br>

STV Factory address: 0xe32435E76fC9A242a351591fFC28b66e3A386335<br> 
STV Factory Tests: test/voteMumbai.js && test/stvFactoryMumbai.js<br> 
Instruction to run all test files are present in the files.

## What is Single Transferable Vote ?

A.K.A preferential voting with multiple vacancies, is an electorial voting system based on proportional representation and ranked voting, used to elect multiple candidates, proposals or representatives, were a
vote may be transferred according to voters preferences if their preferred candidate is eliminated, so that their vote still counts.

<br>

Before getting started with this repo, below is the process of stv as used here, please read:

<br>

First, a voter casts a single vote in the form of a ranked-choice ballot in our case,
a vote function is called which takes the arguments preferedProposal and preferenceRank. 
preferedProposal is an unsigned integer which represents the prefered proposal, 
preferenceRank is an unsigned integer array which represents a voters ranked-choice ballot.

    The vote function,

    function     vote(uint256 preferedProposal, uint256[] calldata preferenceRank) external
    isVoteValid(preferenceRank)    {...}
    
    


<br> <br>

## What is the major benefit of using Single Transferable Vote ?

Single Transferable Vote reduces the number of "wasted" votes (votes which are cast for unsuccessful candidates and for successful candidates over and above those needed to secure a position) by electing multiple representatives for an election. Additionally, surplus votes collected by successful candidates are transferred to aid other candidates.