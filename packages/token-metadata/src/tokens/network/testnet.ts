import { TokenMeta } from '../../types'
import tokens from '../tokens'

export const testnetSymbolToErc20AddressMap = {
  INJ: '0xAD1794307245443B3Cb55d88e79EEE4d8a548C03',
  USDT: '0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5',
  APE: '0x44C21afAaF20c270EBbF5914Cfc3b5022173FEB7',
  USDC: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
  wETH: '0xdB309Bb079EB419C18fe7D568c61cD2FdB65D9aF',
}

export const testnetSymbolToCw20AddressMap = {
  SOL: 'inj12ngevx045zpvacus9s6anr258gkwpmthnz80e9',
  USDC: {
    USDCet: 'inj12sqy9uzzl3h3vqxam7sz9f0yvmhampcgesh3qw',
  },
}

export const getTokensBySymbolForTestnet = () =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, token) => {
      const tokenMeta = { ...tokens[token] } as TokenMeta

      if (!tokenMeta.erc20 && !tokenMeta.cw20 && !tokenMeta.cw20s) {
        return {
          ...result,
          [token.toUpperCase()]: tokenMeta,
        }
      }

      const tokenSymbol = token as keyof typeof testnetSymbolToErc20AddressMap
      const testnetAddressFromMap = testnetSymbolToErc20AddressMap[tokenSymbol]
      const cw20TokenKey = token as keyof typeof testnetSymbolToCw20AddressMap
      const cw20TestnetAddressFromMap =
        testnetSymbolToCw20AddressMap[cw20TokenKey]

      if (!testnetAddressFromMap && !cw20TestnetAddressFromMap) {
        return {
          ...result,
          [token.toUpperCase()]: tokenMeta,
        }
      }

      const mappedTokenMeta = { ...tokenMeta }

      if (testnetAddressFromMap && mappedTokenMeta.erc20) {
        mappedTokenMeta.erc20.address = testnetAddressFromMap
      }

      if (cw20TestnetAddressFromMap) {
        if (
          mappedTokenMeta.cw20 &&
          typeof cw20TestnetAddressFromMap === 'string'
        ) {
          mappedTokenMeta.cw20.address = cw20TestnetAddressFromMap
        }

        if (
          mappedTokenMeta.cw20s &&
          typeof cw20TestnetAddressFromMap !== 'string'
        ) {
          const cw20Maps = mappedTokenMeta.cw20s.map((cw20) => {
            const symbol = cw20.symbol as keyof typeof cw20TestnetAddressFromMap

            if (!cw20TestnetAddressFromMap[symbol]) {
              return cw20
            }

            return {
              ...cw20,
              address: cw20TestnetAddressFromMap[symbol],
            }
          })

          mappedTokenMeta.cw20s = cw20Maps
        }
      }

      return {
        ...result,
        [token.toUpperCase()]: mappedTokenMeta,
      }
    },
    {},
  ) as Record<string, TokenMeta>
