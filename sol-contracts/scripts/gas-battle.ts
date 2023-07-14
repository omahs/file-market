import * as hre from "hardhat";
import {program} from "commander";
const util = require("util");
const request = util.promisify(require("request"));


async function callRpc(method: string, params: string) {
  const network = process.env.HARDHAT_NETWORK;
  let url: string;
  if (network === 'filecoin') {
    url = 'https://filecoin-mainnet.chainstacklabs.com/rpc/v1';
  } else {
    url = 'https://api.calibration.node.glif.io/rpc/v1';
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
  program.option("-to, --to <string>");
  program.parse();
  const args = program.opts();

  let accounts = await hre.ethers.getSigners();

  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "")
  console.log(priorityFee)

  const tx = await accounts[0].sendTransaction({
    to: args.to,
    value: "2000000000000000000000",
    maxPriorityFeePerGas: "0x9e58217",
    maxFeePerGas: "3300000000",
    // nonce: 3505,
  })

  console.log(tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});