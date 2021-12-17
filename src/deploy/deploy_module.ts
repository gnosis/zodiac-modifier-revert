import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const FirstAddress = '0x0000000000000000000000000000000000000001';

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer, owner, target, avatar } = await getNamedAccounts();
  const { deploy } = deployments;
  const args = [owner, target, avatar];

  await deploy('Revert', {
    from: deployer,
    args,
    log: true,
  });
};

deploy.tags = ['revert-modifier'];
export default deploy;
