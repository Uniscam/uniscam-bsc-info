import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Box, Flex, Text } from 'rebass'
import { TYPE } from '../../Theme'
import { Divider } from '../../components'
import LocalLoader from '../LocalLoader'
import { useMedia } from 'react-use'
import TokenLogo from '../TokenLogo'
import Link from '../Link'
import FormattedName from '../FormattedName'
import { formattedNum, formattedPercent } from '../../utils'
import { useApyType } from '../../hooks'
import getDForceApy from '../../api/getApy'

function StrategyListItem({ item, index, color, disbaleLinks }) {
  const below600 = useMedia('(max-width: 600px)')
  const [, apyType] = useApyType(item.yToken)
  const [itemApy, setItemApy] = useState(0)
  
  useEffect(() => {
    const getApy = async () => {
      if (apyType === 'dForce') {
        const { apy: apyRes } = await getDForceApy(item.uTokenSymbol)
        setItemApy(apyRes)
      }
    }
    getApy()
  }, [apyType, item.uTokenSymbol])

  const liquidity = formattedNum(item.uTokenTotalLiquidity, true)
  const apy = formattedPercent(itemApy)

  return (
    <DashGrid style={{ height: '48px' }} disbaleLinks={disbaleLinks} focus={true}>
      {!below600 && (
        <DataText area="name" fontWeight="500">
          <div style={{ marginRight: '20px', width: '10px' }}>{index + 1}</div>
        </DataText>
      )}
      <DataText area="name" fontWeight="500">
        <TokenLogo address={item.uToken} size={below600 ? 16 : 20} />
        <Link style={{ marginLeft: '20px', whiteSpace: 'nowrap' }} color={color} external href={'https://bscscan.com/address/' + item.uToken}>
          <FormattedName
            text={item.uTokenSymbol}
            maxCharacters={below600 ? 8 : 16}
            adjustSize={true}
            link={true}
          />
        </Link>
      </DataText>
      <DataText area="name" fontWeight="500">
        <TokenLogo address={item.yToken} size={below600 ? 16 : 20} />
        <Link style={{ marginLeft: '20px', whiteSpace: 'nowrap' }} color={color} external href={'https://bscscan.com/address/' + item.yToken}>
          <FormattedName
            text={item.yTokenSymbol}
            maxCharacters={below600 ? 8 : 16}
            adjustSize={true}
            link={true}
          />
        </Link>
      </DataText>
      <DataText area="liq">{liquidity}</DataText>
      <DataText area="apy">{apy}</DataText>
    </DashGrid>
  )
}

function StrategyList({ pairs, color, disbaleLinks, maxItems = 10 }) {
  const pairList = Object.keys(pairs).map(key => pairs[key]);
  const _strategyList = pairList.reduce((prevList, pair) => {
    const newList = [...prevList]
    const token0Info = (pair.token0 && pair.yToken0) ? {
      uToken: pair.token0.id,
      uTokenName: pair.token0.name,
      uTokenSymbol: pair.token0.symbol,
      uTokenTotalLiquidity: pair.token0.totalLiquidity,
      yToken: pair.yToken0.id,
      yTokenSymbol: pair.yToken0.symbol
    } : null
    const token1Info = (pair.token1 && pair.yToken1) ? {
      uToken: pair.token1.id,
      uTokenName: pair.token1.name,
      uTokenSymbol: pair.token1.symbol,
      uTokenTotalLiquidity: pair.token1.totalLiquidity,
      yToken: pair.yToken1.id,
      yTokenSymbol: pair.yToken1.symbol
    } : null
    if (!!token0Info) newList.push(token0Info)
    if (!!token1Info) newList.push(token1Info)
    return newList
  }, [])
  const strategyList = _strategyList.filter((item, index) => {
    const _item = JSON.stringify(item)
    return index === _strategyList.findIndex(obj => {
      return JSON.stringify(obj) === _item;
    });
  })
  console.log('Pairs:', pairs, 'PairList:', pairList, 'StrategyList:', strategyList)

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = maxItems

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [pairs])

  useEffect(() => {
    if (pairs) {
      let extraPages = 1
      if (Object.keys(pairs).length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(Object.keys(pairs).length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [ITEMS_PER_PAGE, pairs])

  return (
    <ListWrapper>
      <DashGrid
        center={true}
        disbaleLinks={disbaleLinks}
        style={{ height: 'fit-content', padding: '0 1.125rem 1rem 1.125rem' }}
      >
        <Flex alignItems="center" justifyContent="flexStart">
          <TYPE.main area="index">Index</TYPE.main>
        </Flex>
        <Flex alignItems="center" justifyContent="flexStart">
          <TYPE.main area="utoken">uToken</TYPE.main>
        </Flex>
        <Flex alignItems="center" justifyContent="flexStart">
          <TYPE.main area="ytoken">yToken</TYPE.main>
        </Flex>
        <Flex alignItems="center" justifyContent="flexEnd">
          <ClickableText
            area="liq"
            // onClick={e => {
            //   setSortedColumn(SORT_FIELD.LIQ)
            //   setSortDirection(sortedColumn !== SORT_FIELD.LIQ ? true : !sortDirection)
            // }}
          >
            {/* Liquidity {sortedColumn === SORT_FIELD.LIQ ? (!sortDirection ? '↑' : '↓') : ''} */}
            Liquidity
          </ClickableText>
        </Flex>
        <Flex alignItems="center">
          <ClickableText
            area="apy"
            // onClick={e => {
            //   setSortedColumn(SORT_FIELD.APY)
            //   setSortDirection(sortedColumn !== SORT_FIELD.APY ? true : !sortDirection)
            // }}
          >
            {/* APY {sortedColumn === SORT_FIELD.APY ? (!sortDirection ? '↑' : '↓') : ''} */}
            APY
          </ClickableText>
        </Flex>
      </DashGrid>
      <Divider />
      <List p={0}>
        {strategyList ? strategyList.map((item, index) => (
          <StrategyListItem key={index} item={item} index={index} color={color} disbaleLinks={disbaleLinks} />
        )) : <LocalLoader /> }
      </List>
      <PageButtons>
        <div
          onClick={e => {
            setPage(page === 1 ? page : page - 1)
          }}
        >
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
        <div
          onClick={e => {
            setPage(page === maxPage ? page : page + 1)
          }}
        >
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>
    </ListWrapper>
  )
}

const ListWrapper = styled.div``

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 80px 80px 1fr 1fr;
    grid-template-areas: 'utoken ytoken liq apy';
  padding: 0 1.125rem;

  /* > * {
    justify-content: flex-end;

    :first-child {
      justify-content: flex-start;
      text-align: left;
      width: 20px;
    }
  } */

  @media screen and (min-width: 740px) {
    padding: 0 1.125rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-areas: 'utoken ytoken liq apy';
  }

  @media screen and (min-width: 1080px) {
    padding: 0 1.125rem;
    grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'index utoken ytoken liq apy';
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 0.25fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'index utoken ytoken liq apy';
  }
`

const ClickableText = styled(Text)`
  color: ${({ theme }) => theme.text1};
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  text-align: end;
  user-select: none;
`

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.primary1};
  opacity: ${props => (props.faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.text1};

  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`

export default withRouter(StrategyList)
