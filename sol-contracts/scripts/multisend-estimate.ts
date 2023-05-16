import * as hre from "hardhat";
import { program } from "commander";
import {MultiSender__factory} from "../typechain-types";

async function main() {
  program.option("-instance, --instance <string>");
  program.parse();
  const args = program.opts();

  let accounts = await hre.ethers.getSigners();

  const factory = new MultiSender__factory(accounts[0]);
  const multiSender = factory.attach(args.instance);

  const existingEstimation = await multiSender.estimateGas.multisendEther([
    "0xb0d956114889303AAa90a7De0fB9FA0bC00E1634",
    "0x47C1Cbb1D676B4464c19C5c58deaA50bA468C69B",
    "0x00bE2AEDFC6F01FF941Bc72200Cf10B1B9C4Be2C",
    "0x8F2b694F19f6A0E724267B88C40bee5a1c5bF981",
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x073a52Ff0773687714fBA7084F9D786f547ABe8C",
    "0x4a830bfBF0A9cC100CF766D12A23Bcb5C3d44c29",
    "0xcb1E894FC45FCE1190Af3cD97188195C3CB9E0d8",
    "0xEBA8d3A502955c29790F53238ca5ED44a3fEE2b3",
    "0xad86dEd91ecE8F3eA3995f3E1E15d100a2c3625b"
  ], "10000000", {
    value: "100000000"
  });

  console.log("existing accounts", existingEstimation);

  const newEstimation = await multiSender.estimateGas.multisendEther([
    "0xD8911022B7d3D2E195c825d8F185739d051778Ea",
    "0xC6858B9fc98A99A1E5Dd7B8cdd0f81C6E9F8a742",
    "0xf4E22D07B23b1552c38900092bFe093f04D2E243",
    "0x11f1AdE67191aA2230a9AaF6f7Ae1cC5DA813c5C",
    "0x48A4a2d5B964cBef21EF95c61E467e195fce9e5E",
    "0xa0312a5e208B35A7972F66505f654dF0cC8a366B",
    "0x784520D5a443e59c986C3Ac78BddE2eD0cADC38A",
    "0xA7D139e0406E2a2A3b10aBf39DC3FC912e9dD6ED",
    "0xEeBBcC4F7C9993ECAcB5607dF7af6165B488163F",
    "0x0edA0A4356417504D3Fe25E491A4FC776Ab273A6"
  ], "10000000", {
    value: "100000000"
  });

  console.log("new accounts", newEstimation);

  const emptyEstimation = await multiSender.estimateGas.multisendEther([], "10000000");
  console.log("empty", emptyEstimation);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});