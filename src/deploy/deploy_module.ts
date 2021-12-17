import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const FirstAddress = '0x0000000000000000000000000000000000000001';

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const args = [FirstAddress, FirstAddress, FirstAddress];

  const txCheck = await deploy('TransactionCheck', {
    from: deployer,
    log: true,
  });

  await deploy('Revert', {
    from: deployer,
    args,
    log: true,
    deterministicDeployment: true,
    libraries: {
      TransactionCheck: txCheck.address,
    },
  });
};

deploy.tags = ['revert-modifier'];
export default deploy;
