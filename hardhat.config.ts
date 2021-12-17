import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import 'solidity-coverage';
import 'hardhat-deploy';
import 'hardhat-gas-reporter';
import 'hardhat-contract-sizer';
import dotenv from 'dotenv';
import type { HttpNetworkUserConfig } from 'hardhat/types';
import yargs from 'yargs';
import './src/tasks/setup';

const argv = yargs
  .option('network', {
    type: 'string',
    default: 'hardhat',
  })
  .help(false)
  .version(false).argv;

// Load environment variables.
dotenv.config();
const {
  INFURA_KEY,
  MNEMONIC,
  ETHERSCAN_API_KEY,
  PK,
  OWNER_ADDRESS,
  TARGET_ADDRESS,
  AVATAR_ADDRESS,
} = process.env;

const DEFAULT_MNEMONIC =
  'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat';

const sharedNetworkConfig: HttpNetworkUserConfig = {};
if (PK) {
  console.log('yah');
  sharedNetworkConfig.accounts = [PK];
} else {
  sharedNetworkConfig.accounts = {
    mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
  };
}

if (['rinkeby', 'mainnet'].includes(argv.network) && INFURA_KEY === undefined) {
  throw new Error(
    `Could not find Infura key in env, unable to connect to network ${argv.network}`
  );
}

export default {
  paths: {
    artifacts: 'build/artifacts',
    cache: 'build/cache',
    deploy: 'src/deploy',
    sources: 'contracts',
  },
  solidity: {
    compilers: [{ version: '0.8.6' }, { version: '0.6.12' }],
    settings: {
      optimizer: {
        enabled: true,
        runs: 1,
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    mainnet: {
      ...sharedNetworkConfig,
      url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    },
    rinkeby: {
      ...sharedNetworkConfig,
      url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
    },
    xdai: {
      ...sharedNetworkConfig,
      url: 'https://xdai.poanetwork.dev',
    },
    matic: {
      ...sharedNetworkConfig,
      url: 'https://rpc-mainnet.maticvigil.com',
    },
  },
  namedAccounts: {
    deployer: 0,
    owner: OWNER_ADDRESS,
    target: TARGET_ADDRESS,
    avatar: AVATAR_ADDRESS,
  },
  mocha: {
    timeout: 2000000,
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    // @ts-ignore-next-line
    proxyResolver(transaction) {
      throw transaction;
      // @ts-ignore-next-line
      console.log(this.data);
    },
  },
};
