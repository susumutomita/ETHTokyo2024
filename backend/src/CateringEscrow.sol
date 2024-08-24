// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CateringEscrow is Ownable {
    uint256 private serviceIdCounter;
    uint256 private chefIdCounter;

    enum ServiceStatus {
        Created,
        InProgress,
        Completed,
        Cancelled
    }

    struct Service {
        uint256 id;
        address payable provider;
        address payable customer;
        uint256 amount;
        ServiceStatus status;
    }

    struct ChefProfile {
        string name;
        string description;
        string specialty;
        uint256 voteCount;
    }

    mapping(uint256 => Service) public services;
    mapping(address => ChefProfile) public chefProfiles; // シェフのプロフィールを保存
    address[] public chefAddresses; // 登録されたシェフのアドレスを追跡

    event ServiceCreated(uint256 indexed serviceId, address indexed provider, address indexed customer, uint256 amount);
    event ServiceStarted(uint256 indexed serviceId);
    event ServiceCompleted(uint256 indexed serviceId);
    event ServiceCancelled(uint256 indexed serviceId);
    event PaymentReleased(uint256 indexed serviceId, address indexed provider, uint256 amount);
    event ChefProfileSubmitted(address indexed chef, string name, string description, string specialty);
    event Voted(address indexed chef, uint256 voteCount);

    modifier onlyCustomer(uint256 serviceId) {
        require(msg.sender == services[serviceId].customer, "Only customer can call this function");
        _;
    }

    modifier onlyProvider(uint256 serviceId) {
        require(msg.sender == services[serviceId].provider, "Only provider can call this function");
        _;
    }

    constructor() Ownable(msg.sender) {
        serviceIdCounter = 0;
        chefIdCounter = 0;
    }

    function createService(address payable _provider) external payable {
        require(msg.value > 0, "Service amount must be greater than zero");

        serviceIdCounter += 1;
        uint256 newServiceId = serviceIdCounter;

        services[newServiceId] = Service({
            id: newServiceId,
            provider: _provider,
            customer: payable(msg.sender),
            amount: msg.value,
            status: ServiceStatus.Created
        });

        emit ServiceCreated(newServiceId, _provider, msg.sender, msg.value);
    }

    function submitChefProfile(string memory _name, string memory _description, string memory _specialty) external {
        require(bytes(_name).length > 0, "Name is required");
        require(bytes(_description).length > 0, "Description is required");
        require(bytes(_specialty).length > 0, "Specialty is required");

        if (bytes(chefProfiles[msg.sender].name).length == 0) {
            chefAddresses.push(msg.sender); // 新しいシェフの場合、アドレスを追加
        }

        chefProfiles[msg.sender] = ChefProfile(_name, _description, _specialty, 0);
        emit ChefProfileSubmitted(msg.sender, _name, _description, _specialty);
    }

    mapping(address => mapping(address => bool)) public hasVoted;

    function vote(address _chef) external {
        require(bytes(chefProfiles[_chef].name).length > 0, "Chef does not exist");
        require(!hasVoted[msg.sender][_chef], "You have already voted for this chef");

        chefProfiles[_chef].voteCount += 1;
        hasVoted[msg.sender][_chef] = true;
        emit Voted(_chef, chefProfiles[_chef].voteCount);
    }

    function getChefProfiles() external view returns (address[] memory, ChefProfile[] memory) {
        uint256 chefCount = chefAddresses.length;
        ChefProfile[] memory profiles = new ChefProfile[](chefCount);

        for (uint256 i = 0; i < chefCount; i++) {
            profiles[i] = chefProfiles[chefAddresses[i]];
        }

        return (chefAddresses, profiles);
    }

    function startService(uint256 serviceId) external onlyCustomer(serviceId) {
        require(services[serviceId].status == ServiceStatus.Created, "Service must be in Created status");
        services[serviceId].status = ServiceStatus.InProgress;
        emit ServiceStarted(serviceId);
    }

    function completeService(uint256 serviceId) external onlyProvider(serviceId) {
        require(services[serviceId].status == ServiceStatus.InProgress, "Service must be in InProgress status");
        services[serviceId].status = ServiceStatus.Completed;
        emit ServiceCompleted(serviceId);
    }

    function releasePayment(uint256 serviceId) external onlyCustomer(serviceId) {
        require(
            services[serviceId].status == ServiceStatus.Completed, "Service must be completed before releasing payment"
        );

        Service memory service = services[serviceId];
        (bool success,) = service.provider.call{value: service.amount}("");
        require(success, "Transfer failed");
        emit PaymentReleased(serviceId, service.provider, service.amount);

        delete services[serviceId];
    }

    function cancelService(uint256 serviceId) external onlyCustomer(serviceId) {
        require(services[serviceId].status == ServiceStatus.Created, "Service must be in Created status");

        Service memory service = services[serviceId];
        services[serviceId].status = ServiceStatus.Cancelled;

        (bool success,) = service.customer.call{value: service.amount}("");
        require(success, "Refund failed");

        emit ServiceCancelled(serviceId);

        delete services[serviceId];
    }

    receive() external payable {
        revert("Direct transfers not allowed");
    }
}
