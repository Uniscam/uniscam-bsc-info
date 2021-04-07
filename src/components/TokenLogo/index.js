import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { isAddress } from '../../utils/index.js'
import PlaceHolder from '../../assets/placeholder.png'
import EthereumLogo from '../../assets/eth.png'
import DegoLogo from '../../assets/dego.png'
import MetaLogo from '../../assets/meta.png'
import DAOLogo from '../../assets/DAO.png'
import NAPLogo from '../../assets/NAP.png'
import ForceProtocol from '../../assets/forceprotocol.webp'

const isStringSize = (size) => {
  if (typeof size === 'string') return parseInt(size)
  if (typeof size === 'number') return size
  return size
}

const BAD_IMAGES = {}

const Inline = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
`

const Image = styled.img`
  width: ${({ size }) => isStringSize(size) + 'px'};
  height: ${({ size }) => isStringSize(size) + 'px'};
  background-color: white;
  border-radius: 50%;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`

const StyledEthereumLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    width: ${({ size }) => isStringSize(size) + 'px'};
    height: ${({ size }) => isStringSize(size) + 'px'};
  }
`

export default function TokenLogo({ address, header = false, size = 24, ...rest }) {
  size = isStringSize(size)

  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [address])

  if (error || BAD_IMAGES[address]) {
    return (
      <Inline>
        <Image {...rest} alt={''} src={PlaceHolder} size={size} />
      </Inline>
    )
  }

  // hard coded fixes for trust wallet api issues
  if (address?.toLowerCase() === '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb') {
    address = '0x42456d7084eacf4083f1140d3229471bba2949a8'
  }

  if (address?.toLowerCase() === '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f') {
    address = '0xc011a72400e58ecd99ee497cf89e3775d4bd732f'
  }

  if (address?.toLowerCase() === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') {
    return (
      <StyledEthereumLogo size={size} {...rest}>
        <img
          src={EthereumLogo}
          style={{ boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.075)', borderRadius: '24px' }}
          alt=""
        />
      </StyledEthereumLogo>
    )
  }

  let path = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${isAddress(
    address
  )}/logo.png`

  if (address?.toLowerCase() === '0x12e2fcfa079fc23ae82ab82707b402410321103f')
    path = 'https://ssimg.frontenduse.top/article/2020/10/22/2be5eb8b1704d4c663d1b68509a8a353.png'
  else if (address?.toLowerCase() === '0x658a109c5900bc6d2357c87549b651670e5b0539')
    path = ForceProtocol
  else if (address?.toLowerCase() === '0x3fda9383a84c05ec8f7630fe10adf1fac13241cc')
    path = DegoLogo
  else if (address?.toLowerCase() === '0xffafff7686f2d7cc0e4727c5d30bd37b05708a1c')
    path = DAOLogo
  else if (address?.toLowerCase() === '0xacae234ea5fddd1657038b7aa6b597664056c954')
    path = MetaLogo
  else if (address?.toLowerCase() === '0x4d05de8d57b238457d62dadd6d3b395bbc8c9824')
    path = NAPLogo
  else if (address?.toLowerCase() === '0xebd31fd3e751b19b745e64b6422ef195b7015cc4')
    path = 'https://raw.githubusercontent.com/Uniscam/token-icons/master/bsc-mainnet/0xebd31fd3e751b19b745e64b6422ef195b7015cc4.png'

  return (
    <Inline>
      <Image
        {...rest}
        alt={''}
        src={path}
        size={size}
        onError={event => {
          BAD_IMAGES[address] = true
          setError(true)
          event.preventDefault()
        }}
      />
    </Inline>
  )
}
