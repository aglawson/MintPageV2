import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { Contract, ethers } from 'ethers'
import { metadata, abi } from './secret'
import axios from 'axios'
import { useState } from 'react'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [count, setCount] = useState(1)
  const [price, setPrice] = useState(0)
  const [message, setMessage] = useState('Connect Wallet')
  const [userAddress, setUserAddress] = useState('')
  const contractAddress = '0xAE9EF6F43272C1F5c12cB7530B2868D4055FCbF6'
  
  let provider, signer, nft

  async function init(e) {
    if(e) {
      e.preventDefault()
    }
    if(window.ethereum == null) {
      alert('Metamask not installed')
      throw('Metamask not installed')
    }
    provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    signer = await provider.getSigner()
    setUserAddress(await signer.getAddress())
    setMessage('Connected')

    nft = new ethers.Contract(contractAddress, abi, provider)
    const p = await nft.price()
    setPrice(parseInt(p))
    console.log(parseInt(p))
  }
  //init()

  async function mint(e) {
    e.preventDefault()
    await init(e)
    const value = count * price
    await nft.connect(signer).mint(count, [], {value: value.toString()})
  }

  async function handleClick(e) {
    e.preventDefault()

    if(message == 'Connect Wallet') {
      await init(e)
      return
    } 
    if(message == 'Connected') {
      try{
        await mint(e)
      } catch(error) {
        alert(error)
      }
      return
    }
    return
  }

  return (
    <>
      <Head>
        <title>GaslesslyNFT</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            <code className={styles.code}>{message == 'Connect Wallet' ? 'Gaslessly NFT' : `Connected: ${userAddress}`}</code>
          </p>
        </div>

        <div className={styles.center}>
            <h2 className={inter.className} style={{marginTop: '-65%'}}>
              Minting {count} for {price !== 0 ? ((count * price) / 10**18).toFixed(2) : '?'} ETH
            </h2>
          </div>
          <img style={{borderRadius: '15%', marginTop: '-15%'}} className={styles.card} src={metadata} width={250} height={250}></img>
          <div className={styles.zone}>
            <p><button onClick={(e) => handleClick(e)} className={styles.card}><code className={styles.code}>{message == 'Connect Wallet' ? 'Connect Wallet' : `Mint`}</code></button></p>
            <button className={styles.card} width={10} height={10} onClick={() => count > 1 ? setCount(count - 1) : setCount(count)}><img src='https://cdn-icons-png.flaticon.com/512/43/43625.png' alt='-' width={25} height={25}></img></button>
            <button className={styles.card} onClick={() => count < 10 ? setCount(count + 1) : setCount(count)}><img width={25} height={25} alt='^' src='https://cdn-icons-png.flaticon.com/512/748/748113.png'></img></button> 
          </div>
        <div className={styles.grid} style={{marginBottom: '-6%'}}>
          <div className={styles.card}>
          <h2 className={inter.className}>
            Utility <span>-&gt;</span>
          </h2>
          <p className={inter.className}>
            Get lifetime access to all Developer Tools and APIs we build.
          </p>
          </div>
          <div className={styles.card}>
          <h2 className={inter.className}>
            Governance <span>-&gt;</span>
          </h2>
          <p className={inter.className}>
            Decide what gets built next in our ecosystem of dev tools.
          </p>
          </div>
          <div className={styles.card}>
          <h2 className={inter.className}>
            Community <span>-&gt;</span>
          </h2>
          <p className={inter.className}>
            By devs, for devs. Let's learn from each other.
          </p>
          </div>
          {/* <div className={styles.card}>
          <h2 className={inter.className}>
            Utility <span>-&gt;</span>
          </h2>
          <p className={inter.className}>
            Get lifetime access to all Developer Tools and APIs we build.
          </p>
          </div> */}
        </div>
      </main>
    </>
  )
}
