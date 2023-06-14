import * as hre from "hardhat";
import { program } from "commander";

const util = require("util")
const request = util.promisify(require("request"))

async function callRpc(method: string, params: string) {
  const network = process.env.HARDHAT_NETWORK;
  let url: string;
  if (network === 'filecoin') {
    url = 'https://rpc.ankr.com/filecoin';
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
  program.option("-to, --to <string>");
  program.parse();
  const args = program.opts();

  let accounts = await hre.ethers.getSigners();

  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "")

  const tx = await accounts[0].sendTransaction({
    to: args.to,
    value: "6450000000000000000",
    maxPriorityFeePerGas: priorityFee,
    maxFeePerGas: "1100000000",
  })

  console.log(tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});