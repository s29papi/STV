// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;

import "./Stv.sol";

contract STVFactory {
        event    Deploy(address contractAddr);

       
        function deploy(string  memory _electionName, uint _electionDate, uint _electionDuration, uint _totalNoOfAvailableSlots)    external     {
                        Stv    _contract = new Stv(_electionName, _electionDate, _electionDuration, _totalNoOfAvailableSlots);
                        emit   Deploy(address(_contract));
        }
}