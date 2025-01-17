import { HardhatUserConfig } from "hardhat/config";
import { HttpNetworkUserConfig } from "hardhat/types/config";
import "@nomicfoundation/hardhat-toolbox";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";
import fs from "fs";

const mumbaiAccounts: string[] = [];
const zkSyncTestnetAccounts: string[] = [];
const zkSyncMainnetAccounts: string[] = [];
const calibrationAccounts: string[] = [];
const filecoinAccounts: string[] = [];

if (fs.existsSync(".mumbai-secret")) {
  mumbaiAccounts.push(fs.readFileSync(".mumbai-secret").toString().trim());
}
if (fs.existsSync(".calibration-secret")) {
  calibrationAccounts.push(fs.readFileSync(".calibration-secret").toString().trim());
}
if (fs.existsSync(".test-zksync-secret")) {
  zkSyncTestnetAccounts.push(fs.readFileSync(".test-zksync-secret").toString().trim());
}
if (fs.existsSync(".main-zksync-secret")) {
  zkSyncMainnetAccounts.push(fs.readFileSync(".main-zksync-secret").toString().trim());
}
if (fs.existsSync(".mainnet-secret")) {
  filecoinAccounts.push(fs.readFileSync(".mainnet-secret").toString().trim());
}

const mumbaiConfig: HttpNetworkUserConfig = {
  url: "https://matic-mumbai.chainstacklabs.com/",
  chainId: 80001,
  accounts: mumbaiAccounts,
};
const calibrationConfig: HttpNetworkUserConfig = {
  url: "https://filecoin-calibration.chainup.net/rpc/v1",
  chainId: 314159,
  accounts: calibrationAccounts,
  timeout: 1000000000
};
const zksyncConfig = {
  url: "https://mainnet.era.zksync.io",
  accounts: zkSyncMainnetAccounts,
  zksync: true,
  ethNetwork: "mainnet",
  verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
  timeout: 1000000000,
};
const testnetZksyncConfig = {
  url: "https://testnet.era.zksync.dev",
  accounts: zkSyncTestnetAccounts,
  ethNetwork: "goerli",
  zksync: true,
  verifyURL: "https://zksync2-testnet-explorer.zksync.dev/contract_verification",
  timeout: 1000000000,
};

if (process.env.POLYGON_QUIKNODE_URL) {
  mumbaiConfig.url = process.env.POLYGON_QUIKNODE_URL;
}
const filecoinConfig: HttpNetworkUserConfig = {
  url: "https://filecoin-mainnet.chainstacklabs.com/rpc/v1",
  chainId: 314,
  accounts: filecoinAccounts,
  timeout: 1000000000
}
console.log("mumbai cfg:", mumbaiConfig);
console.log("calibrationConfig cfg:", calibrationConfig);
console.log("zksync testnet cfg:", testnetZksyncConfig)
console.log("mainnet cfg:", filecoinConfig)

const config: HardhatUserConfig = {
  zksolc: {
    version: "1.3.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      zksync: false
    },
    mumbai: mumbaiConfig,
    calibration: calibrationConfig,
    filecoin: filecoinConfig,
    testnetZksync: testnetZksyncConfig,
    zksync: zksyncConfig
  },
  etherscan: {
    apiKey: {
      polygon:
        process.env.MINTER_GURU_POLYGONSCAN_API_KEY !== undefined
          ? process.env.MINTER_GURU_POLYGONSCAN_API_KEY
          : "",
      polygonMumbai:
        process.env.MINTER_GURU_POLYGONSCAN_API_KEY !== undefined
          ? process.env.MINTER_GURU_POLYGONSCAN_API_KEY
          : "",
    },
  },
};

export default config;
