// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiSender {
    function multisendEther(address[] calldata _contributors, uint256 value) external payable {
        require(_contributors.length <= 200);
        for (uint256 i = 0; i < _contributors.length; i++) {
            payable(_contributors[i]).transfer(value);
        }
    }
}
