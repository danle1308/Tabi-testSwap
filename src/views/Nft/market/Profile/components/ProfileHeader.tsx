import { NextLinkFromReactRouter as ReactRouterLink } from 'components/NextLink'
import { BscScanIcon, Flex, IconButton, Link, Button, useModal } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import { getBscScanLink } from 'utils'
import { formatNumber } from 'utils/formatBalance'
import truncateHash from 'utils/truncateHash'
import { Achievement, Profile } from 'state/types'
import { useWeb3React } from '@web3-react/core'
import EditProfileAvatar from './EditProfileAvatar'
import BannerHeader from '../../components/BannerHeader'
import StatBox, { StatBoxItem } from '../../components/StatBox'
import MarketPageTitle from '../../components/MarketPageTitle'
import EditProfileModal from './EditProfileModal'
import AvatarImage from '../../components/BannerHeader/AvatarImage'

interface HeaderProps {
  accountPath: string
  profile: Profile
  achievements: Achievement[]
  nftCollected: number
  isAchievementsLoading: boolean
  isNftLoading: boolean
  isProfileLoading: boolean
  onSuccess?: () => void
}

// Account and profile passed down as the profile could be used to render _other_ users' profiles.
const ProfileHeader: React.FC<HeaderProps> = ({
  accountPath,
  profile,
  achievements,
  nftCollected,
  isAchievementsLoading,
  isNftLoading,
  isProfileLoading,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [onEditProfileModal] = useModal(
    <EditProfileModal
      onSuccess={() => {
        if (onSuccess) {
          onSuccess()
        }
      }}
    />,
    false,
  )

  const isConnectedAccount = account?.toLowerCase() === accountPath?.toLowerCase()
  const numNftCollected = !isNftLoading ? (nftCollected ? formatNumber(nftCollected, 0, 0) : '-') : null
  const numPoints = !isProfileLoading ? (profile?.points ? formatNumber(profile.points, 0, 0) : '-') : null
  const numAchievements = !isAchievementsLoading
    ? achievements?.length
      ? formatNumber(achievements.length, 0, 0)
      : '-'
    : null

  const avatarImage = profile?.nft?.image?.thumbnail || '/images/nfts/no-profile-md.png'

  const getBannerImage = () => {
    const imagePath = '/images/teams'
    if (profile) {
      switch (profile.teamId) {
        case 1:
          return `${imagePath}/storm-banner.png`
        case 2:
          return `${imagePath}/flippers-banner.png`
        case 3:
          return `${imagePath}/cakers-banner.png`
        default:
          break
      }
    }
    return `${imagePath}/no-team-banner.png`
  }

  const getAvatar = () => {
    const getIconButtons = () => {
      return (
        // TODO: Share functionality once user profiles routed by ID
        <Flex display="inline-flex">
          {accountPath && (
            <IconButton
              as="a"
              target="_blank"
              style={{
                width: 'fit-content',
              }}
              href={getBscScanLink(accountPath, 'address') || ''}
              // @ts-ignore
              alt={t('View Velas Explorer for user address')}
            >
              <BscScanIcon width="20px" color="textActive" />
            </IconButton>
          )}
        </Flex>
      )
    }

    const getImage = () => {
      return (
        <>
          {profile && accountPath && isConnectedAccount ? (
            <EditProfileAvatar
              src={avatarImage}
              alt={t('User profile picture')}
              onSuccess={() => {
                if (onSuccess) {
                  onSuccess()
                }
              }}
            />
          ) : (
            <AvatarImage src={avatarImage} alt={t('User profile picture')} />
          )}
        </>
      )
    }
    return (
      <>
        {getImage()}
        {getIconButtons()}
      </>
    )
  }

  const getTitle = () => {
    if (profile?.username) {
      return `@${profile.username}`
    }

    if (accountPath) {
      return truncateHash(accountPath, 5, 3)
    }

    return null
  }

  const renderDescription = () => {
    const getActivateButton = () => {
      if (!profile) {
        return (
          <ReactRouterLink to="/create-profile">
            <Button mt="16px">{t('Activate Profile')}</Button>
          </ReactRouterLink>
        )
      }
      return (
        <Button width="fit-content" mt="16px" onClick={onEditProfileModal}>
          {t('Reactivate Profile')}
        </Button>
      )
    }

    return (
      <Flex flexDirection="column" mb={[16, null, 0]} mr={[0, null, 16]}>
        {accountPath && profile?.username && (
          <Link href={getBscScanLink(accountPath, 'address')} external bold color="primary">
            {truncateHash(accountPath)}
          </Link>
        )}
        {accountPath && isConnectedAccount && (!profile || !profile?.nft) && getActivateButton()}
      </Flex>
    )
  }

  return (
    <>
      <BannerHeader bannerImage={getBannerImage()} bannerAlt={t('User team banner')} avatar={getAvatar()} />
      <MarketPageTitle pb="48px" title={getTitle()} description={renderDescription()}>
        <StatBox>
          <StatBoxItem title={t('NFT Collected')} stat={numNftCollected} />
          <StatBoxItem title={t('Points')} stat={numPoints} />
          <StatBoxItem title={t('Achievements')} stat={numAchievements} />
        </StatBox>
      </MarketPageTitle>
    </>
  )
}

export default ProfileHeader
