import { NextLinkFromReactRouter } from 'components/NextLink'
import { UIButton } from 'components/TabiSwap/components/ui'
import { ViewDetailIcon } from 'components/TabiSwap/components/svgs'
import { FC } from 'react'

type Button = {
  href: string
}

const LaunchpadViewDetailButton: FC<Button> = ({ href, ...props }) => {
  return (
    <UIButton.UIStyledButton as={NextLinkFromReactRouter} to={href || '/swap'} {...props}>
      View Details <ViewDetailIcon color="BlackColor" ml="4px" />
    </UIButton.UIStyledButton>
  )
}

export default LaunchpadViewDetailButton
