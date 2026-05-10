# base-rewards-distributor

> On-Chain Rewards Distribution for Base L2

Efficient, gas-optimized rewards distribution for Base protocols. Supports Merkle airdrops, linear streaming (Sablier-style), epoch-based distributions, and protocol fee sharing.

## Distribution Types
| Type | Use Case | Gas Cost |
|------|----------|----------|
| Merkle Airdrop | One-time token distribution | Low |
| Linear Stream | Vesting / salary | Medium |
| Epoch Rewards | Weekly/monthly protocol rewards | Low |
| Fee Sharing | Protocol revenue to stakers | Low |

## Features
- 🌳 Merkle tree-based mass distribution (millions of recipients)
- 🚿 Real-time token streaming (per-second)
- 📅 Epoch-based reward snapshots
- 💰 Protocol fee auto-distribution to stakers
- 🔒 Replay protection
- 📊 Off-chain merkle tree generator

## Installation
```bash
git clone https://github.com/fabt31/base-rewards-distributor
npm install
forge install && forge build
```

## Generate Merkle Tree
```typescript
import { generateMerkleTree } from "./src/merkle";

const tree = generateMerkleTree([
  { address: "0xAlice", amount: "1000000000000000000" },
  { address: "0xBob", amount: "500000000000000000" },
]);

console.log("Root:", tree.root);
console.log("Alice proof:", tree.getProof("0xAlice"));
```

## License
MIT