// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CateringEscrow} from "../src/CateringEscrow.sol";

contract CateringEscrowScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        CateringEscrow escrow = new CateringEscrow();
        console.log("CateringEscrow deployed at:", address(escrow));
        vm.stopBroadcast();
    }
}
