import Axios from 'axios'

/**
 * Get dForce APY
 * @param {string} symbol Symbol
 */
const getDForceApy = async (symbol) => {
  const resData = await Axios.get('https://markets.dforce.network/api/bsc/getApy/')
  const data = resData.data
  const result = data[`d${symbol.toUpperCase()}`]
  console.log('getDForceApy::resData:', resData, 'symbol:', symbol, 'result:', result)

  return {
    apy: result.now_apy,
    totalUnderlying: result.total_underlying
  }
}

export default getDForceApy

export {
  getDForceApy
}
