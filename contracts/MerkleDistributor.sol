// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract MerkleDistributor is Ownable, ReentrancyGuard {
    IERC20 public immutable token;
    bytes32 public merkleRoot;
    mapping(address => bool) public claimed;
    mapping(uint256 => uint256) private claimedBitMap;

    uint256 public totalClaimed;
    uint256 public claimDeadline;

    event Claimed(address indexed account, uint256 amount);
    event RootUpdated(bytes32 newRoot);

    constructor(address token_, bytes32 root_, uint256 deadline) Ownable(msg.sender) {
        token = IERC20(token_);
        merkleRoot = root_;
        claimDeadline = deadline;
    }

    function claim(address account, uint256 amount, bytes32[] calldata proof) external nonReentrant {
        require(block.timestamp < claimDeadline, "Claim period ended");
        require(!claimed[account], "Already claimed");
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(account, amount))));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid proof");
        claimed[account] = true;
        totalClaimed += amount;
        token.transfer(account, amount);
        emit Claimed(account, amount);
    }

    function updateRoot(bytes32 newRoot) external onlyOwner { merkleRoot = newRoot; emit RootUpdated(newRoot); }
    function recoverUnclaimed() external onlyOwner {
        require(block.timestamp > claimDeadline, "Not expired");
        token.transfer(owner(), token.balanceOf(address(this)));
    }
}