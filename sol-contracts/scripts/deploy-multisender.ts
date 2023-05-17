import {ethers} from "hardhat";
import {MultiSender__factory} from "../typechain-types";
const util = require("util")
const request = util.promisify(require("request"))

async function callRpc(method: string, params: string) {
  const network = process.env.HARDHAT_NETWORK;
  let url: string;
  if (network === 'filecoin') {
    url = 'https://filecoin-mainnet.chainstacklabs.com/rpc/v1';
  } else {
    url = 'https://api.hyperspace.node.glif.io/rpc/v1';
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

async function main() {
  let accounts = await ethers.getSigners();

  const multiSenderFactory = new MultiSender__factory(accounts[0]);

  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "")

  console.log(priorityFee);

  const instance = await multiSenderFactory.deploy({
    maxPriorityFeePerGas: priorityFee,
  });
  console.log(instance.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});