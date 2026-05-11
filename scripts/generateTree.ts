import { generateMerkleTree } from "../src/merkle";
import * as fs from "fs";
const recipients = JSON.parse(fs.readFileSync("recipients.json", "utf8"));
const tree = generateMerkleTree(recipients);
console.log("Merkle root:", tree.root);
fs.writeFileSync("merkle-output.json", JSON.stringify({ root: tree.root, leaves: tree.leaves }, null, 2));
console.log("Tree saved to merkle-output.json");
