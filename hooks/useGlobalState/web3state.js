import { useState, useEffect } from 'react'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Ens from 'ethereum-ens'
import { attendedEligiblePOAPEvents } from 'libs/getPoapEvents'
import { isArguments } from 'lodash'

let web3Modal = null

export const getEnsName = async ({ address, provider }) => {
  const ens = new Ens(provider)
  let ensName = null
  try {
    ensName = await ens.reverse(address).name()
    if (address != (await ens.resolver(ensName).addr())) {
      ensName = null
    }
  } catch (err) {
    console.log('Error getting ENS', err)
  }
  return ensName
}

const connect = async ({ setState, ...state }) => {
  console.log('connect clicked')

  if (web3Modal === null && typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
      network: 'mainnet', // optional
      cacheProvider: true, // optional
      providerOptions: {
        injected: {
          display: {},
          package: null,
        },
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: 'INFURA_ID', // required
          },
        },
      },
    })
  }

  const provider = await web3Modal.connect()
  const web3 = new Web3(provider)
  const [address, ...otherAdrresses] = await web3.eth.getAccounts()
  setState({ address, web3, provider })

  attendedEligiblePOAPEvents(address, provider).then(hasEligiblePOAPtokens => {
    console.log('hasEligiblePOAPtokens', hasEligiblePOAPtokens)
    setState({ hasEligiblePOAPtokens })
  })

  getEnsName({ address, provider }).then(ensName => {
    setState({ ensName })
  })

  if (!state.provider) {
    provider.on('accountsChanged', async accounts => {
      console.log('accountsChanged', accounts)
      const [address, ...otherAdrresses] = accounts
      const ensName = await getEnsName({ address, provider })
      setState({ address, ensName })
    })

    // Subscribe to chainId change
    provider.on('chainChanged', chainId => {
      console.log('chainChanged', chainId)
    })

    // Subscribe to provider connection
    provider.on('connect', info => {
      console.log('connect', info)
    })

    // Subscribe to provider disconnection
    provider.on('disconnect', error => {
      console.log('disconnect', error)
    })
  }
}

export default {
  initialState: {
    address: null,
    ensName: null,
    provider: null,
    web3: null,
    hasEligiblePOAPtokens: null,
  },
  actions: {
    connect,
    logout: async ({ setState }) => {
      setState({
        address: null,
        ensName: null,
        web3: null,
        provider: null,
      })
      await web3Modal.clearCachedProvider()
    },
    initWeb3: async ({ setState }) => {
      if (typeof window !== 'undefined' && web3Modal == null) {
        web3Modal = new Web3Modal({
          network: 'mainnet', // optional
          cacheProvider: true, // optional
          providerOptions: {
            injected: {
              display: {},
              package: null,
            },
            walletconnect: {
              package: WalletConnectProvider,
              options: {
                infuraId: 'INFURA_ID', // required
              },
            },
          },
        })

        if (web3Modal.cachedProvider) {
          console.log('web3Modal.cachedProvider')
          connect({ setState })
        }
      }
    },
  },
}