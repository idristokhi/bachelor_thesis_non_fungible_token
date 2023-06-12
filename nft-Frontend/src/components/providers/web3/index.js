import detectEthereumProvider from "@metamask/detect-provider";
import * as ethers from 'ethers';
import { loadContract } from "./hooks-dirc/loadContract";
import { setupHook } from "./hooks-dirc/setupHooks";


const { createContext, useContext, useEffect, useState, useMemo } = require("react");

const Web3Context = createContext(null)

const createWeb3State=({web3,provider,contract,isLoading})=>{
  return{
      web3,
      provider,
      contract,
      isLoading,
      hooks:setupHook({web3,provider,contract})
  }

}

export default function Web3Provider({children}) {
  const [web3Api, setWeb3Api] = useState(createWeb3State({web3:null,provider:null,contract:null,isLoading:true}))



  useEffect(() => {
    const loadProvider = async () => {

      const provider = await detectEthereumProvider()
      if (provider) {
        const web3 = new ethers.providers.Web3Provider(provider);
        const contract=await loadContract("MainContract",web3)
        const signer=web3.getSigner();
        const signedContract=contract.connect(signer)
        console.log(signedContract,"fhfhfh")
        setWeb3Api(createWeb3State({
          web3,
          provider,
          contract:signedContract,
          isLoading:false

        }))
      } else {
        setWeb3Api(api => ({...api, isLoading: false}))
        console.error("Please, install Metamask.")
      }
    }

    loadProvider()
  }, [])


  const _web3Api = useMemo(() => {
    const{web3,provider}=web3Api
    return {
      ...web3Api,
      isWeb3Loaded: web3 !=null,
      connect: provider ?
        async () => {
          try {
            await provider.request({method: "eth_requestAccounts"})
          } catch {
               window.location.reload()
          }
        } :
        () => console.error("Cannot connect to Metamask, try to reload your browser please.")
    }
  }, [web3Api])

  
  return (
    <Web3Context.Provider value={_web3Api}>
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  return useContext(Web3Context)
}

export function useHooks(cb){
  const { hooks }=useWeb3()
   return cb(hooks)
}































