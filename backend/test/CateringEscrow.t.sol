// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {CateringEscrow} from "../src/CateringEscrow.sol";

contract CateringEscrowTest is Test {
    CateringEscrow public escrow;
    address payable public provider = payable(address(0x1));
    address payable public customer = payable(address(this));

    receive() external payable {}

    function setUp() public {
        escrow = new CateringEscrow();
    }

    function test_CreateService() public {
        uint256 amount = 1 ether;
        escrow.createService{value: amount}(provider);

        (uint256 id, address p, address c, uint256 amt, CateringEscrow.ServiceStatus status) = escrow.services(1);

        assertTrue(id != 0);
        assertEq(p, provider);
        assertEq(c, customer);
        assertEq(amt, amount);
        assertEq(uint8(status), uint8(CateringEscrow.ServiceStatus.Created));
    }

    function test_StartService() public {
        uint256 amount = 1 ether;
        escrow.createService{value: amount}(provider);
        escrow.startService(1);

        (,,,, CateringEscrow.ServiceStatus status) = escrow.services(1);

        assertEq(uint8(status), uint8(CateringEscrow.ServiceStatus.InProgress));
    }

    function test_CompleteService() public {
        uint256 amount = 1 ether;
        escrow.createService{value: amount}(provider);
        escrow.startService(1);
        vm.prank(provider);
        escrow.completeService(1);

        (,,,, CateringEscrow.ServiceStatus status) = escrow.services(1);

        assertEq(uint8(status), uint8(CateringEscrow.ServiceStatus.Completed));
    }

    function test_ReleasePayment() public {
        uint256 amount = 1 ether;
        escrow.createService{value: amount}(provider);
        escrow.startService(1);
        vm.prank(provider);
        escrow.completeService(1);

        escrow.releasePayment(1);

        (uint256 id,,,,) = escrow.services(1);
        assertEq(id, 0);
    }

    function test_CancelService() public {
        uint256 amount = 1 ether;
        escrow.createService{value: amount}(provider);

        vm.expectEmit(true, true, true, true);
        emit CateringEscrow.ServiceCancelled(1);

        escrow.cancelService(1);

        (uint256 id,,,,) = escrow.services(1);
        assertEq(id, 0, "Service was not properly cancelled and deleted");
    }
}
