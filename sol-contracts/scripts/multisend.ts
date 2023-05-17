import * as hre from "hardhat";
import {program} from "commander";
import {MultiSender__factory} from "../typechain-types";
import fs from "fs";

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
  program.option("-instance, --instance <string>");
  program.option("-path, --path <string>");
  program.option("-num, --num <number>");
  program.parse();
  const args = program.opts();

  const count = 200;
  const addressesData = fs.readFileSync(args.path).toString().trim();
  const addresses: string[] = JSON.parse(addressesData);
  let addressesSlice: string[];
  let ind = Number(args.num);
  if ((ind+1)*count > addresses.length) {
    addressesSlice = addresses.slice(ind*count, addresses.length)
  } else {
    addressesSlice = addresses.slice(ind*count, (ind+1)*count);
  }
  let accounts = await hre.ethers.getSigners();

  const factory = new MultiSender__factory(accounts[0]);
  const multiSender = factory.attach(args.instance);

  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "")

  const single = hre.ethers.BigNumber.from("40000000000000000");
  const countBN = hre.ethers.BigNumber.from(addressesSlice.length);
  const value = single.mul(countBN);
  console.log(single);
  console.log(countBN);
  console.log(value);
  console.log(addressesSlice);
  const newEstimation = await multiSender.multisendEther(addressesSlice, single, {
    value: value,
    maxPriorityFeePerGas: priorityFee,
    maxFeePerGas: "1000000000",
  });

  console.log("new accounts", newEstimation.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});