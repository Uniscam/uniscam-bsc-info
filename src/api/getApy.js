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
    apy: result.now_apy
    // totalUnderlying: result.total_underlying
  }
}

/**
 * Get ForTube APY
 * @param {string} symbol Symbol
 */
const getForTubeApy = async (symbol) => {
  const resData = await Axios.get('https://api.for.tube/api/v1/bank_markets?mode=extended', {
    headers: {
      'Referer': 'https://for.tube/',
      'Authorization': 'SFMyNTY.g2gDbQAAACoweDAwMDAwMDAwNGZhOWU2MzVkYmU5MWM4M2FlZTM1N2QwMTQ5NDkzNmRuBgCfP3F7dAFiAAFRgA.8_HNNWK2A0pVVvH71_Ckv9q9NxRdIVxafnG5aLzvd-c',
      'Access-Control-Allow-Origin': '*'
    }
  })
  let result = { apy: 0 }
  /**
   * @type {Array}
   */
  const data = resData.data && resData.data.data
  if (data) {
    const find = data.find(item => item.token_symbol === symbol.toUpperCase())
    if (find){
      result = { apy: find.deposit_interest_rate }
    }
  }
  console.log('getForTubeApy::resData:', resData, 'symbol:', symbol, 'result:', result)
  return result
}

export default getDForceApy

export {
  getDForceApy,
  getForTubeApy
}
