pragma solidity ^0.7.0;

import "./Stv.sol";

contract STVFactory {
            event    Deploy(address    contractAddr);

            

            function deploy(string memory _voteName, uint _date, uint _duration, bytes32[] memory _proposalNames) external {
                       Stv    _contract = new Stv(_voteName, _date, _duration, _proposalNames);
                       emit   Deploy(address(_contract));
            }
}