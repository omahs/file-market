import {ethers} from "hardhat";
import * as hre from "hardhat";
import {
  FileBunniesCollection__factory,
  FilemarketCollectionV2__factory,
  FilemarketExchangeV2__factory,
  FraudDeciderWeb2V2__factory,
  Mark3dAccessTokenV2__factory,
  PublicCollection__factory
} from "../typechain-types";
import "@nomicfoundation/hardhat-chai-matchers";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { Wallet, Contract } from "zksync-web3";
const util = require("util")
const request = util.promisify(require("request"))

const genRanHex = (size: number) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

async function deployZkContract(
    wallet: Wallet,
    contractName: string,
    args: any[]
): Promise<Contract> {
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact(contractName);
  let deploymentFee = await deployer.estimateDeployFee(artifact, args);
  console.log(
      contractName,
      " fee: ",
      ethers.utils.formatEther(deploymentFee.toString()),
      " ETH"
  );

  return deployer.deploy(artifact, args);
}

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

async function main() {
  let accounts = await ethers.getSigners();

  if (process.env.HARDHAT_NETWORK == "testnetZksync") {
    // @ts-ignore
    const wallet = new Wallet(hre.config.networks.testnetZksync.accounts[0]);

    const collectionToClone = await deployZkContract(
      wallet,
      "contracts/ZkFilemarketCollectionV2.sol:FilemarketCollectionV2",
      []
    );
    console.log("collectionToClone address: ", collectionToClone.address);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const fraudDecider = await deployZkContract(
      wallet,
      "FraudDeciderWeb2V2",
      []
    );
    console.log("fraudDecider address: ", fraudDecider.address);
    await new Promise(resolve => setTimeout(resolve, 5000));

    const globalSalt = genRanHex(128);
    console.log("global salt", globalSalt);
    const accessToken = await deployZkContract(wallet, "contracts/ZkMark3dAccessTokenV2.sol:Mark3dAccessTokenV2", [
      "FileMarket Access Token",
      "FileMarket",
      "",
      "0x" + globalSalt,
      // collectionToClone.address,
        "0x7F23a2BAf3718ab587f8051d2333079C250eD7b8",
      true,
      fraudDecider.address,
    ]);
    console.log("accessToken address: ", accessToken.address);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const exchange = await deployZkContract(wallet, "contracts/ZkFilemarketExchangeV2.sol:FilemarketExchangeV2", [])
    console.log("exchange address: ", exchange.address);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const publicCollection = await deployZkContract(wallet, "contracts/ZkPublicCollection.sol:PublicCollection", [
      "FileMarket",
      "FMRT",
      "ipfs://QmZm4oLQoyXZLJzioYCjGtGXGHqsscKvWJmWXMVhTXZtc9",
      accounts[0].address,
      accounts[0].address,
      "0x",
      fraudDecider.address,
      true,
    ])
    console.log("public collection address: ", publicCollection.address);
  } else {
    const accessTokenFactory = new Mark3dAccessTokenV2__factory(accounts[0]);
    const fraudDeciderFactory = new FraudDeciderWeb2V2__factory(accounts[0]);
    const collectionFactory = new FilemarketCollectionV2__factory(accounts[0]);
    const publicCollectionFactory = new PublicCollection__factory(accounts[0]);
    const fileBunniesCollectionFactory = new FileBunniesCollection__factory(accounts[0]);
    const exchangeFactory = new FilemarketExchangeV2__factory(accounts[0]);

    const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "")
    console.log(priorityFee);

    const collectionToClone = await collectionFactory.deploy({
      maxPriorityFeePerGas: priorityFee,
    });
    console.log("collection address: ", collectionToClone.address);

    let fraudDecider = await fraudDeciderFactory.deploy({
      maxPriorityFeePerGas: priorityFee,
    });
    console.log("fraud decider address: ", fraudDecider.address);

    const globalSalt = genRanHex(128);
    console.log("global salt", globalSalt);

    let accessToken = await accessTokenFactory.deploy("FileMarket Access Token", "FileMarket", "",
        "0x" + globalSalt, collectionToClone.address, true, fraudDecider.address, {
          maxPriorityFeePerGas: priorityFee,
        });
    console.log("access token address: ", accessToken.address);

    let publicCollection = await publicCollectionFactory.deploy(
        "FileMarket",
        "FMRT",
        "ipfs://QmZm4oLQoyXZLJzioYCjGtGXGHqsscKvWJmWXMVhTXZtc9",
        accounts[0].getAddress(),
        accounts[0].getAddress(),
        "0x",
        fraudDecider.address,
        true,
        {
          maxPriorityFeePerGas: priorityFee,
        });
    console.log("public collection address: ", publicCollection.address);

    let exchange = await exchangeFactory.deploy({
      maxPriorityFeePerGas: priorityFee,
    });
    console.log("exchange address: ", exchange.address);

    let fileBunniesCollection = await fileBunniesCollectionFactory.deploy(
        "FileBunnies",
        "FBNS",
        "ipfs://QmQUr4ApevgdEKCbE7W4YHXCCF7JNAVzX2BgZTntaAGQzC",
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
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});