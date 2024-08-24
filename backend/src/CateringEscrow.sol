// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CateringEscrow is Ownable {
    uint256 private serviceIdCounter;

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

    mapping(uint256 => Service) public services;

    event ServiceCreated(uint256 indexed serviceId, address indexed provider, address indexed customer, uint256 amount);
    event ServiceStarted(uint256 indexed serviceId);
    event ServiceCompleted(uint256 indexed serviceId);
    event ServiceCancelled(uint256 indexed serviceId);
    event PaymentReleased(uint256 indexed serviceId, address indexed provider, uint256 amount);

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

        delete services[serviceId]; // 支払い後にサービスを削除
    }

    function cancelService(uint256 serviceId) external onlyCustomer(serviceId) {
        require(services[serviceId].status == ServiceStatus.Created, "Service must be in Created status");

        Service storage service = services[serviceId];
        service.status = ServiceStatus.Cancelled; // 状態をキャンセルに変更

        (bool success,) = service.customer.call{value: service.amount}("");
        require(success, "Refund failed"); // 返金失敗時の処理

        emit ServiceCancelled(serviceId);
    }
}
