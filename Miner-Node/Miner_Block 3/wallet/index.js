var fs = require("fs");

const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
  constructor(HTTP_PORT) {
    this.genKey(HTTP_PORT)
  }
  
  toString() {
    return `Wallet -
    publicKey: ${this.publicKey.toString()}`
  }
  
  genKey(HTTP_PORT) {
    // this.publicKey = this.keyPair.getPublic().encode('hex');
    // let data = this.keyPair + "\n" + this.publicKey
    this.filepath = `${HTTP_PORT}.txt`
    
    if (fs.existsSync(this.filepath)) {
      console.log('File Key exists');
      const data = fs.readFileSync(this.filepath, 'utf8');
      let list_data = data.split('\n');
      // console.log(list_data);
      this.keyPair = ChainUtil.restoreKeyPair(list_data[0], list_data[1])
    } else {
      console.log('File Key not found!');
      this.keyPair = ChainUtil.genKeyPair();
      const exportedPrivate = this.keyPair.getPrivate()
      const exportedPublic = this.keyPair.getPublic('hex')
      
      let data = exportedPrivate + "\n" + exportedPublic
      fs.writeFile(this.filepath, data, function (err) {
      console.log('New file has been created.');
      });
    }
    this.publicKey = this.keyPair.getPublic('hex')
    // console.log(this.publicKey)
    // console.log(this.keyPair.getPrivate('hex'))
    console.log("           Your Public Key : "+ this.publicKey);
  }

  genKeyNode() {
      let keyPair = ChainUtil.genKeyPair();
      let exportedPrivate = keyPair.getPrivate()
      let exportedPublic = keyPair.getPublic('hex')
      
      return {
        'privateKey': exportedPrivate, 
        'publicKey': exportedPublic
      };
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  createTransaction(recipient, cpu,ram,disk, alert ,blockchain, transactionPool) {

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, cpu, ram, disk,alert );
    } else 
    {
      transaction = Transaction.newTransaction(this, recipient, cpu, ram, disk, alert );
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-wallet';
    return blockchainWallet;
  }
}

module.exports = Wallet;