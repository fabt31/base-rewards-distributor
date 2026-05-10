import { ethers } from "ethers";

interface Recipient { address: string; amount: string; }

interface MerkleTree {
  root: string;
  leaves: string[];
  getProof: (address: string) => string[];
}

function hashLeaf(address: string, amount: string): string {
  const inner = ethers.solidityPackedKeccak256(["address", "uint256"], [address, BigInt(amount)]);
  return ethers.keccak256(ethers.concat([inner, inner]));
}

export function generateMerkleTree(recipients: Recipient[]): MerkleTree {
  const leaves = recipients.map(r => hashLeaf(r.address, r.amount));
  const indexMap = new Map(recipients.map((r, i) => [r.address.toLowerCase(), i]));

  function buildTree(nodes: string[]): string[] {
    if (nodes.length === 1) return nodes;
    const parent: string[] = [];
    for (let i = 0; i < nodes.length; i += 2) {
      const left = nodes[i];
      const right = i + 1 < nodes.length ? nodes[i + 1] : left;
      const combined = left < right
        ? ethers.keccak256(ethers.concat([left, right]))
        : ethers.keccak256(ethers.concat([right, left]));
      parent.push(combined);
    }
    return buildTree(parent);
  }

  const root = buildTree([...leaves])[0];

  return {
    root,
    leaves,
    getProof: (address: string) => {
      const idx = indexMap.get(address.toLowerCase());
      if (idx === undefined) throw new Error("Address not in tree");
      const proof: string[] = [];
      let nodes = [...leaves];
      let i = idx;
      while (nodes.length > 1) {
        const sibling = i % 2 === 0 ? nodes[i + 1] ?? nodes[i] : nodes[i - 1];
        proof.push(sibling);
        nodes = nodes.filter((_, idx) => idx % 2 === 0).map((n, j) => {
          const r = leaves[j * 2 + 1] ?? n;
          return n < r ? ethers.keccak256(ethers.concat([n, r])) : ethers.keccak256(ethers.concat([r, n]));
        });
        i = Math.floor(i / 2);
      }
      return proof;
    }
  };
}