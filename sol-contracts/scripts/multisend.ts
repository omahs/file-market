import * as hre from "hardhat";
import { program } from "commander";
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
  program.option("-instance, --instance <string>");
  program.parse();
  const args = program.opts();

  let accounts = await hre.ethers.getSigners();

  const factory = new MultiSender__factory(accounts[0]);
  const multiSender = factory.attach(args.instance);

  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "")

  const newEstimation = await multiSender.multisendEther([
    "0x0E52dd93039dcbe4a531090C90e4a8340c5a2876",
    "0x8880D850e1Fb9671A2e26775e96966F6f80B101A",
    "0x96032Cd6365447DA971Ec4eb288CBFc3e59fe338",
    "0x6781875eca59177Bf14344C41096f2f1b7D2fc31",
    "0x3ADeF4778f22B5271A76c8646A347B0fB8dB36f1",
    "0x21636afF2E459718C3Fc577d90817EE783eF015A",
    "0x84EbEbf82EE45AE0f00A02126a73052FcceACC4F",
    "0x11CBb99E4B3D0632b5e23a1c88afe1f6b2b41C7C",
    "0x3cEb8700cc59EDD9B6c3fe659Be728959a28E058",
    "0x80F3a282A5E30EfA11Ef2a57fec90BD21fAeda2E"
  ], [
    "10000000",
    "10000000",
    "10000000",
    "10000000",
    "10000000",
    "10000000",
    "10000000",
    "10000000",
    "10000000",
    "10000000"
  ], {
    value: "100000000",
    maxPriorityFeePerGas: priorityFee,
  });

  console.log("new accounts", newEstimation.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});