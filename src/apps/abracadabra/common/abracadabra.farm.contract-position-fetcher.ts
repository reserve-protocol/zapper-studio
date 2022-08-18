import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { MasterChefTemplateContractPositionFetcher } from '~position/template/master-chef.template.contract-position-fetcher';

import { AbracadabraContractFactory, PopsicleChef } from '../contracts';

export abstract class AbracadabraFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PopsicleChef> {
  rewardRateUnit = RewardRateUnit.SECOND;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraContractFactory) protected readonly contractFactory: AbracadabraContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PopsicleChef {
    return this.contractFactory.popsicleChef({ address, network: this.network });
  }

  async getPoolLength(contract: PopsicleChef): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: PopsicleChef, poolIndex: number): Promise<string> {
    return contract.poolInfo(poolIndex).then(v => v.stakingToken);
  }

  async getRewardTokenAddress(contract: PopsicleChef): Promise<string> {
    return contract.ice();
  }

  async getTotalAllocPoints(contract: PopsicleChef): Promise<BigNumberish> {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate(contract: PopsicleChef): Promise<BigNumberish> {
    return contract.icePerSecond();
  }

  async getPoolAllocPoints(contract: PopsicleChef, poolIndex: number): Promise<BigNumberish> {
    return contract.poolInfo(poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance(address: string, contract: PopsicleChef, poolIndex: number): Promise<BigNumberish> {
    return contract.userInfo(poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance(address: string, contract: PopsicleChef, poolIndex: number): Promise<BigNumberish> {
    return contract.pendingIce(poolIndex, address);
  }
}