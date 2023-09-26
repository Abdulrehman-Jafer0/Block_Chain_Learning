const sha256 = require("crypto-js/sha256");

class Block {
  constructor(timestamp, data, prevHash = "") {
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = prevHash;
    this.hash = this.calculateHash();
    this.nonce = 0; // nonce can be any random number which I'll used to keep track
  }

  calculateHash() {
    const hash = sha256(
      this.timestamp + JSON.stringify(this.data) + this.prevHash + this.nonce
    ).toString();
    return hash;
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("hash", this.hash);
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    const block = new Block(0, "26/09/2023", { amount: 0 }, "0");
    return block;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addToBlockChain(block) {
    const prevBlockHash = this.getLatestBlock().hash;
    block.prevHash = prevBlockHash;
    block.hash = block.mineBlock(this.difficulty); // difficulty of 4 zeros in the start
    this.chain.push(block);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];
      if (currentBlock.hash !== currentBlock.calculateHash()) return false; // first check
      if (currentBlock.prevHash !== prevBlock.hash) return false; // second check
    }
    return true;
  }
}

const savjeeCoin = new BlockChain();
