import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { Contract, ethers } from 'ethers'
import { metadata, abi } from './secret'
import axios from 'axios'
import { useEffect, useState } from 'react'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

const linkedin = 'https://cdn-icons-png.flaticon.com/512/3128/3128219.png'
const github = 'https://cdn-icons-png.flaticon.com/512/4926/4926624.png'
const twitter = 'https://cdn-icons-png.flaticon.com/512/3128/3128212.png'
const etherscan = 'https://goerli.etherscan.io/'

export default function Home() {
  const [count, setCount] = useState(1)
  const [price, setPrice] = useState(0)
  const [message, setMessage] = useState('Connect Wallet')
  const [userAddress, setUserAddress] = useState('')
  const [display, setDisplay] = useState('none')
  const [tx, setTx] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [windowWidth, setWindowWidth] = useState(-1)
 
  // Hook
  function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
    setWindowWidth(window.innerWidth)


    useEffect(() => {
      // only execute all the code below in client side
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        setWindowWidth(window.innerWidth)
      }
      
      // Add event listener
      window.addEventListener("load", handleResize);
      
      // Call handler right away so state gets updated with initial window size
      handleResize();
      
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
  }

  if(typeof window !== 'undefined' && windowWidth === -1) {
    setWindowWidth(window.innerWidth)
    useWindowSize()
  }

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

  async function mint(e) {
    e.preventDefault()
    //await init(e)
    provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    signer = await provider.getSigner()
    nft = new ethers.Contract(contractAddress, abi, provider)

    const value = count * price
    const mint = await nft.connect(signer).mint(count, [], {value: value.toString()})
    console.log(mint)
    setTx(mint.hash)
    setModalMessage('Transaction Sent')
    setDisplay('block')
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
        setModalMessage('Error')
        setDisplay('block')
      }
      return
    }
    return
  }

  async function disconnect(e) {
    e.preventDefault()

    setUserAddress('')
    setMessage('Connect Wallet')
  }

  return (
    <>
      <Head>
        <title>Minty</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            <button style={{border: 'none', background: 'none'}} onClick={e => disconnect(e)}><code className={styles.code}>{message == 'Connect Wallet' ? 'Mint NFT' : `Connected: ${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`}</code></button>
          </p>
          <p className={styles.zone}>
          <a href='https://twitter.com/0xlawson' target='blank' style={{border: 'none', background: 'none'}}><img height={25} width={25} style={{background: 'none', border: 'none'}} src={twitter}></img></a>
          <a href='https://linkedin.com/in/adrian-lawson' target='blank' style={{border: 'none', background: 'none'}}><img height={25} width={25} style={{background: 'none', border: 'none'}} src={linkedin}></img></a>
          <a href='https://github.com/aglawson' target='blank' style={{border: 'none', background: 'none'}}><img height={25} width={25} style={{background: 'none', border: 'none'}} src={github}></img></a>
          </p>
        </div>

        <div className={styles.center}>
            <h2 className={inter.className} style={{marginTop: '-65%'}}>
              Minting {count} for {price !== 0 ? ((count * price) / 10**18).toFixed(2) : '?'} ETH
            </h2>
          </div>
          <img style={{borderRadius: '15%', marginTop: '-15%'}} className={styles.card} src={metadata} width={300} height={300}></img>
          <div className={windowWidth >= 800 ? styles.zone : styles.zoneMobile}>
            <p><button onClick={(e) => handleClick(e)} className={styles.card}><code className={styles.code}>{message == 'Connect Wallet' ? 'Connect Wallet' : `Mint`}</code></button></p>
            <button className={styles.card} width={1} height={1} onClick={() => count > 1 ? setCount(count - 1) : setCount(count)}><img src='https://cdn-icons-png.flaticon.com/512/43/43625.png' alt='-' width={25} height={25}></img></button>
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
            By devs, for devs. Let's learn from each other!
          </p>
          </div>

          <div onClick={() => setDisplay('none')} className={styles.modal} style={{display: display}}></div>
          <div className={styles.modalMain} style={{display: display}}>
               <p className={styles.code} style={{textAlign: 'center', paddingTop: '5%'}}>{modalMessage}</p>
               <p className={styles.code} style={{textAlign: 'center', marginTop: '15%'}}><a href={modalMessage == 'Transaction Sent' ? `${etherscan}tx/${tx}` : ''} target={modalMessage == 'Transaction Sent' ? '_blank' : '_self'} className={modalMessage == 'Transaction Sent' ? styles.card : styles.code} style={{}}>{modalMessage == 'Transaction Sent' ? 'View on Etherscan' : 'Please try again'}</a></p>
          </div>
        </div>
      </main>
    </>
  )
}
