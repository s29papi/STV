pragma solidity ^0.7.0;

import "./Stv.sol";

contract STVFactory {
        event    Deploy(address contractAddr);

       
        function deploy(string  memory _electionName, uint _electionDate, uint _electionDuration)    external     {
                        Stv    _contract = new Stv(_electionName, _electionDate, _electionDuration);
                        emit   Deploy(address(_contract));
        }
}