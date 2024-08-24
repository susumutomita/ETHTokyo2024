// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/CateringEscrow.sol";

contract CateringEscrowTest is Test {
    CateringEscrow public escrow;
    address payable public provider = payable(address(0x1));
    address payable public customer = payable(address(this));
    address public voter = address(0x2);
    address public tokenRecipient = address(0x3);

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

    function test_SubmitChefProfile() public {
        escrow.submitChefProfile("Chef A", "Expert in Italian Cuisine", "Pasta");
        (string memory name, string memory description, string memory specialty, uint256 voteCount) =
            escrow.chefProfiles(address(this));

        assertEq(name, "Chef A");
        assertEq(description, "Expert in Italian Cuisine");
        assertEq(specialty, "Pasta");
        assertEq(voteCount, 0);
    }

    function test_VoteForChef() public {
        // Submit a chef profile and vote for the chef
        escrow.submitChefProfile("Chef B", "Expert in Japanese Cuisine", "Sushi");

        vm.prank(voter);
        escrow.vote(address(this));

        (,,, uint256 voteCount) = escrow.chefProfiles(address(this));
        assertEq(voteCount, 1);
    }

    function test_GetChefProfiles() public {
        // Submit a chef profile and verify the profile retrieval
        escrow.submitChefProfile("Chef A", "Expert in Italian Cuisine", "Pasta");

        (address[] memory addresses, CateringEscrow.ChefProfile[] memory profiles) = escrow.getChefProfiles();

        assertEq(addresses.length, 1);
        assertEq(profiles.length, 1);
        assertEq(profiles[0].name, "Chef A");
        assertEq(profiles[0].description, "Expert in Italian Cuisine");
        assertEq(profiles[0].specialty, "Pasta");
    }

    function test_SendToken() public {
        uint256 initialBalance = escrow.balanceOf(tokenRecipient);
        uint256 amount = 100;

        escrow.sendToken(tokenRecipient, amount);

        uint256 newBalance = escrow.balanceOf(tokenRecipient);
        assertEq(newBalance, initialBalance + amount);
    }
}
