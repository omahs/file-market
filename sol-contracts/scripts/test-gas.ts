import * as hre from "hardhat";
import {program} from "commander";
import {
  FileBunniesCollection__factory, FilemarketCollectionV2__factory,
  FilemarketExchangeV2__factory,
  FraudDeciderWeb2V2__factory
} from "../typechain-types";
import {days} from "@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time/duration";
const util = require("util");
const request = util.promisify(require("request"));

async function callRpc(method: string, params: string) {
  const network = process.env.HARDHAT_NETWORK;
  let url: string;
  if (network === 'filecoin') {
    url = 'https://filecoin-mainnet.chainstacklabs.com/rpc/v1';
  } else {
    url = 'https://filecoin-calibration.chainup.net/rpc/v1';
  }
  const options = {
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params: [],
      id: 1,
    }),
  }
  console.log(options.body);
  const res = await request(options)
  return JSON.parse(res.body).result
}

async function deploy() {
  let accounts = await hre.ethers.getSigners();

  const fraudDeciderFactory = new FraudDeciderWeb2V2__factory(accounts[0]);
  const fileBunniesCollectionFactory = new FileBunniesCollection__factory(accounts[0]);
  const exchangeFactory = new FilemarketExchangeV2__factory(accounts[0]);

  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");

  let fraudDecider = await fraudDeciderFactory.deploy({
    maxPriorityFeePerGas: priorityFee,
  });
  console.log("fraud decider address: ", fraudDecider.address);

  let exchange = await exchangeFactory.deploy({
    maxPriorityFeePerGas: priorityFee,
  });
  console.log("exchange address: ", exchange.address);

  let fileBunniesCollection = await fileBunniesCollectionFactory.deploy(
    "FileBunnies",
    "FBNS",
    "ipfs://QmZm4oLQoyXZLJzioYCjGtGXGHqsscKvWJmWXMVhTXZtc9",
    accounts[0].getAddress(),
    accounts[0].getAddress(),
    accounts[0].getAddress(),
    accounts[0].getAddress(),
    "0x",
    fraudDecider.address,
    true,
    {
      maxPriorityFeePerGas: priorityFee,
    });
  console.log("file bunnies collection address: ", fileBunniesCollection.address);
  const tx = await fileBunniesCollection.setFinalizeTransferTimeout(0);
  console.log("set finalize transfer timeout", tx.hash);
}

async function setFinalizeTimeout(collection: string) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FileBunniesCollection__factory();
  const instance = factory.attach(collection).connect(accounts[0]);

  const tx = await instance.setFinalizeTransferTimeout(0);
  console.log("set finalize transfer timeout", tx.hash);
}

async function mintBatch(collection: string, start: number, count: number) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FileBunniesCollection__factory();
  const instance = factory.attach(collection).connect(accounts[0]);

  const data = [];
  for (let i = 0; i < count; i++) {
    data.push("0x");
  }
  const tx = await instance.mintBatchWithoutMeta(accounts[0].address, start, count, 0, data, {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(tx.hash, tx.gasLimit);
}

async function estimateMintBatch(collection: string, start: number, count: number) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FileBunniesCollection__factory();
  const instance = factory.attach(collection).connect(accounts[0]);

  const data = [];
  for (let i = 0; i < count; i++) {
    data.push("0x");
  }
  const gas = await instance.estimateGas.mintBatchWithoutMeta(accounts[0].address, start, count, 0, data, {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(gas);
}

async function placeOrdersBatch(
  exchange: string,
  collection: string,
  start: number,
  count: number,
  ) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FilemarketExchangeV2__factory();
  const instance = factory.attach(exchange).connect(accounts[0]);

  const ids = [];
  for (let i = 0; i < count; i++) {
    ids.push(start+i);
  }
  const tx = await instance.placeOrderBatch(collection, ids, 10, hre.ethers.constants.AddressZero, {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(tx.hash, tx.gasLimit);
}

async function estimatePlaceOrdersBatch(
  exchange: string,
  collection: string,
  start: number,
  count: number,
) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FilemarketExchangeV2__factory();
  const instance = factory.attach(exchange).connect(accounts[0]);

  const ids = [];
  for (let i = 0; i < count; i++) {
    ids.push(start+i);
  }
  const gas = await instance.estimateGas.placeOrderBatch(collection, ids, 10, hre.ethers.constants.AddressZero, {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(gas);
}

const cid = "ipfs://QmVktEHCq3RaNYhbXfpNPjSiozYNLTu4xSugrKtN4nSPca";

async function addCommonCids(collection: string, start: number, count: number) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FileBunniesCollection__factory();
  const instance = factory.attach(collection).connect(accounts[0]);

  const cids = [];
  for (let i = 0; i < count; i++) {
    cids.push(cid);
  }
  const tx = await instance.addCommonCids(start, cids, {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(tx.hash, tx.gasLimit);
}

async function estimateAddCommonCids(collection: string, start: number, count: number) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FileBunniesCollection__factory();
  const instance = factory.attach(collection).connect(accounts[0]);

  const cids = [];
  for (let i = 0; i < count; i++) {
    cids.push(cid);
  }
  const gas = await instance.estimateGas.addCommonCids(start, cids, {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(gas);
}

async function addUncommonCids(collection: string, start: number, count: number) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FileBunniesCollection__factory();
  const instance = factory.attach(collection).connect(accounts[0]);

  const cids = [];
  for (let i = 0; i < count; i++) {
    cids.push(cid);
  }
  const tx = await instance.addUncommonCids(start, cids, {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(tx.hash, tx.gasLimit);
}

async function estimateAddUncommonCids(collection: string, start: number, count: number) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FileBunniesCollection__factory();
  const instance = factory.attach(collection).connect(accounts[0]);

  const cids = [];
  for (let i = 0; i < count; i++) {
    cids.push(cid);
  }
  const gas = await instance.estimateGas.addUncommonCids(start, cids, {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(gas);
}

async function addCids(collection: string, start: number, count: number) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FileBunniesCollection__factory();
  const instance = factory.attach(collection).connect(accounts[0]);

  const cids = [];
  for (let i = 0; i < count; i++) {
    cids.push(cid);
  }
  const tx = await instance.addPayedCids(start, cids, {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(tx.hash, tx.gasLimit);
}

async function estimateAddCids(collection: string, start: number, count: number) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FileBunniesCollection__factory();
  const instance = factory.attach(collection).connect(accounts[0]);

  const cids = [];
  for (let i = 0; i < count; i++) {
    cids.push(cid);
  }
  const gas = await instance.estimateGas.addPayedCids(start, cids, {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(gas);
}

const publicKey = "0x30820222300d06092a864886f70d01010105000382020f003082020a028202010081b5904fedf3c263cdc963cba1840b8bdc4ed675a1c4c5eda996817c83974041ef94c8be61b3a533e6eae4b352c6da368058fb924bb1bf07c86d355365ff178fc8df2b3693e1bb7a45f5fb24e6e8a51df05b66816be82fe62368f543932252be3682a1297ccf146c4cbc34c7594d0f5df0eaa18bb26e6c1aa91c79d2353b5ccc576fb73445a7c485d7e3535cd25384b9173e44f77a91ca89186c54000f9887228359f02e55af4eb6c02f7fd7bc2f8ec37aaa9fc83e8dee608070140836568a619b95e58a023de6842559fddec0090c07ce8c8a637cf3742b354b2cab66233bb207c9d279f13b7bc756809a77f486e4003a5d14fdf712c909a8b27b15d9c0bbf1a36493c9d77386977591a6b99a1026b63560ad209c90d9a02120831ff70721ac348a1738a966d1a182f2df4f9d757f5c23c2b39d2991bea9239618159da803dbc00855a27e7c747b90fe3b0108935316b57103fd535c9d8c76142bc9627adac4eee5fd96ed06097363437f49e4862412550cc2ef0104fba9dcc63a2eb87b920330801c60cac4ab1df6810026946bbd9e7adb8d9a896c7e2bddb03c97ae43760ab5087538dc2b01b0761241a3448d57e0898f91c5bc72f58375ce939e2d1bb824d37635b5f0a2afe274db43342fc7fb8561007cb589c16dfa7d9d5fbf3236e0bc8a286c844467f2f3c8bfda34dc681217895bf15861b0faaaa2aeabd95b27341b0203010001"

async function buy(exchange: string, collection: string, id: number) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FilemarketExchangeV2__factory();
  const instance = factory.attach(exchange).connect(accounts[0]);

  const tx = await instance.fulfillOrder(collection, publicKey, id, "0x", {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(tx.hash, tx.gasLimit);
}

async function estimateBuy(exchange: string, collection: string, id: number) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FilemarketExchangeV2__factory();
  const instance = factory.attach(exchange).connect(accounts[0]);
  const gas = await instance.estimateGas.fulfillOrder(collection, publicKey, id, "0x", {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(gas);
}

const signature = "bddbe9f15e47aa1e01fd3a68f7dedf4a0096046cf6d7dd0d28ac024ea38bb10a609446ed0a9c8ffc19a4cf9f698c89a6b5635ca63ac82089c4c04db04b9cbae21c";

async function buyWhitelist(exchange: string, collection: string, id: number) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FilemarketExchangeV2__factory();
  const instance = factory.attach(exchange).connect(accounts[0]);
  const tx = await instance.fulfillOrder(collection, publicKey, id, signature, {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(tx.hash, tx.gasLimit);
}

async function estimateBuyWhitelist(exchange: string, collection: string, id: number) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FilemarketExchangeV2__factory();
  const instance = factory.attach(exchange).connect(accounts[0]);
  const gas = await instance.estimateGas.fulfillOrder(collection, publicKey, id, signature, {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(gas);
}

const password = "0x4b18f7520a69130458f608eea6c930dd9bcb853c9835ef77ab0725e7fc1b303c5a6b44bf4b2e39eb90938d747acbbecc93da7a08f22dce07c11669a9647f6a812b05ebfc9aa21a39b7232c86611d94f55d0174384bdb0ebac23af851e0a553d9e1e37126a3a994211aa438e5063c84d663a9706d4ded4dc5fc29f1193491c6baebca6f1518d76a5a34e567a6d9441b1689bd68847de240e0d9e207370b2a0f1f67fafe8e9d78481890f740a35d621fad8b4a3cfee1d4be9f8ef0749865a7e7779efb5902e6c5688b05642b9111a59c86b5b8d544c96400dfc12e4976fa03f9b16b1aacced13894156f2a790e34c0424e3449499099e92e2e31d60232729169f9c34a68a6557ea6745c33c828993b0bfb74d9694b8a84dd70b7dcb4c35d674d8a6b96eb9034707eae02524b7d2cbf85819e1ab1de172685a0977605b6723a3dbd283701d171dd6eed080b538b44a6ca3bec4fa1d0efadb442404a7d8d8283af265f27b25dfd9368f7d91e27f09d3188e2d8c40618e192cd5643dc5befe26ae0eb43747fc3e0fa422d0b47951527334a8dbe89bef7dd5e2ed94338e998cdd68bcb3a4e4ac2b6d340de292b5b7dd35b9dd67faaeaf12fd41b83a4f7e3e62583710c9b2ae48cd2031cda55a603cd5b3bf1add35557654833f5c780aa1239ac5b8d57af216e42354093aeee865d3d9c1e1552cee40a12ccf76920cedbd9255177d99a";

async function setEncryptedPassword(collection: string, id: number) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FileBunniesCollection__factory();
  const instance = factory.attach(collection).connect(accounts[0]);
  const tx = await instance.approveTransfer(id, password, {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(tx.hash, tx.gasLimit);
}

async function estimateSetEncryptedPassword(collection: string, id: number) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FileBunniesCollection__factory();
  const instance = factory.attach(collection).connect(accounts[0]);
  const gas = await instance.estimateGas.approveTransfer(id, password, {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(gas);
}

async function finalizeTransfer(collection: string, id: number) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FileBunniesCollection__factory();
  const instance = factory.attach(collection).connect(accounts[0]);
  const tx = await instance.finalizeTransfer(id, {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(tx.hash, tx.gasLimit);
}

async function estimateFinalizeTransfer(collection: string, id: number) {
  let accounts = await hre.ethers.getSigners();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "");
  const factory = new FileBunniesCollection__factory();
  const instance = factory.attach(collection).connect(accounts[0]);
  const gas = await instance.estimateGas.finalizeTransfer(id, {
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(gas);
}

async function main() {
  program.option("-kind, --kind <string>");
  program.option("-collection, --collection <string>");
  program.option("-exchange, --exchange <string>");
  program.option("-start, --start <number>");
  program.option("-count, --count <number>");
  program.option("-id, --id <number>");
  program.parse();

  const args = program.opts();
  switch (args.kind) {
    case "deploy":
      await deploy();
      break;
    case "set-finalize-timeout":
      await setFinalizeTimeout(args.collection);
      break;
    case "mint-batch":
      await mintBatch(args.collection, Number(args.start), Number(args.count));
      break;
    case "estimate-mint-batch":
      await estimateMintBatch(args.collection, Number(args.start), Number(args.count));
      break;
    case "place-orders":
      await placeOrdersBatch(args.exchange, args.collection, Number(args.start), Number(args.count));
      break;
    case "estimate-place-orders":
      await estimatePlaceOrdersBatch(args.exchange, args.collection, Number(args.start), Number(args.count));
      break;
    case "add-common-cids":
      await addCommonCids(args.collection, Number(args.start), Number(args.count));
      break;
    case "estimate-add-common-cids":
      await estimateAddCommonCids(args.collection, Number(args.start), Number(args.count));
      break;
    case "add-uncommon-cids":
      await addUncommonCids(args.collection, Number(args.start), Number(args.count));
      break;
    case "estimate-add-uncommon-cids":
      await estimateAddUncommonCids(args.collection, Number(args.start), Number(args.count));
      break;
    case "add-cids":
      await addCids(args.collection, Number(args.start), Number(args.count));
      break;
    case "estimate-add-cids":
      await estimateAddCids(args.collection, Number(args.start), Number(args.count));
      break;
    case "buy":
      await buy(args.exchange, args.collection, Number(args.id));
      break;
    case "estimate-buy":
      await estimateBuy(args.exchange, args.collection, Number(args.id));
      break;
    case "buy-whitelist":
      await buyWhitelist(args.exchange, args.collection, Number(args.id));
      break;
    case "estimate-buy-whitelist":
      await estimateBuyWhitelist(args.exchange, args.collection, Number(args.id));
      break;
    case "set-password":
      await setEncryptedPassword(args.collection, Number(args.id));
      break;
    case "estimate-set-password":
      await estimateSetEncryptedPassword(args.collection, Number(args.id));
      break;
    case "finalize-transfer":
      await finalizeTransfer(args.collection, Number(args.id));
      break;
    case "estimate-finalize-transfer":
      await estimateFinalizeTransfer(args.collection, Number(args.id));
      break;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});