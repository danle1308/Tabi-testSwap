import campaignAbi from 'config/abi/tokenPreSale.json'
import { TokenPreSale } from 'config/abi/types/TokenPreSale'
import { FAST_INTERVAL } from 'config/constants'
import { useContract } from 'hooks/useContract'
import useSWRImmutable from 'swr/immutable'
import { BigNumber } from 'ethers'

export interface CampaignData {
  startDate: number
  endDate: number
  priceRate: BigNumber
  maxTokensToSell: BigNumber
  inSale: BigNumber
  vestingStartTime: number
  isLive?: boolean
}

export const useCampaignSigner = (contractAddress: string) => {
  return useContract<TokenPreSale>(contractAddress, campaignAbi, true)
}

export const useCampaign = (contractAddress: string) => {
  return useContract<TokenPreSale>(contractAddress, campaignAbi)
}

export const fetchCampaign = async (campaign: TokenPreSale, round: number): Promise<CampaignData> => {
  const presaleRound = await campaign.presaleRound(round)
  return {
    startDate: Number(presaleRound.presaleStartTime),
    endDate: Number(presaleRound.presaleEndTime),
    priceRate: presaleRound.priceRate,
    maxTokensToSell: presaleRound.maxTokensToSell,
    inSale: presaleRound.inSale,
    vestingStartTime: Number(presaleRound.vestingStartTime),
    isLive: true,
  }
}

export const useCampaignRound = (contractAddress: string, round: number) => {
  const campaign = useCampaign(contractAddress)
  return useSWRImmutable<CampaignData>(
    ['publicCampaignData'],
    async () => {
      const campaignRound = await fetchCampaign(campaign, round)
      return campaignRound
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )
}

export const useClaimable = (contractAddress: string, account: string) => {
  const campaign = useCampaign(contractAddress)
  return useSWRImmutable<BigNumber>(
    ['claimable'],
    async () => {
      const claimAmount = await campaign.claimableBalace(account)
      return claimAmount
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )
}
