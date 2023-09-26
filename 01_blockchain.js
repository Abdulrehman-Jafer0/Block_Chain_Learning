const sha256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, prevHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.prevHash = prevHash;
    this.hash = this.calculateHash();
    this.nonce = 0; // nonce can be any random number which I'll used to keep track
  }

  calculateHash() {
    const hash = sha256(
      this.timestamp +
        JSON.stringify(this.transactions) +
        this.prevHash +
        this.nonce
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
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    const block = new Block(Date.now(), [], "0");
    return block;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  //   addToBlockChain(block) {
  //     const prevBlockHash = this.getLatestBlock().hash;
  //     block.prevHash = prevBlockHash;
  //     block.hash = block.mineBlock(this.difficulty); // difficulty of 4 zeros in the start
  //     this.chain.push(block);
  //   }

  minePendingTransactions(miningRewardAddress) {
    const newBlock = new Block(Date.now(), this.pendingTransactions);
    newBlock.mineBlock(this.difficulty); // no need to save it in a varibale work on ref
    newBlock.prevHash = this.chain[this.chain.length - 1].hash;
    this.chain.push(newBlock);
    this.pendingTransactions = [];

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  checkBalance(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.toAddress == address) {
          balance += trans.amount;
        }
        if (trans.fromAddress == address) {
          balance -= trans.amount;
        }
      }
    }
    return balance;
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

savjeeCoin.createTransaction(new Transaction("osama1", "shani2", 100));
savjeeCoin.createTransaction(new Transaction("shani2", "osama1", 50));
console.log(savjeeCoin.checkBalance("Shafqat"));
savjeeCoin.minePendingTransactions("Shafqat");
console.log(savjeeCoin.pendingTransactions);
savjeeCoin.minePendingTransactions("Zuka");
console.log(savjeeCoin.checkBalance("Shafqat"));

console.log(JSON.stringify(savjeeCoin, null, 4));
