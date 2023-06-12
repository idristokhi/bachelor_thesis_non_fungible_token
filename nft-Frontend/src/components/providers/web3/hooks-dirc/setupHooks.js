
import {handler as createUseAccount } from "./useAccount1";
import { handler as createUseNetwork } from "./useNetwork";
import { handler as createUseListedNft} from "./useListedNft";
import { handler as createOwnedNft } from "./useOwnedNft";



export const setupHook=({web3,provider,contract})=>{
  
   return{
    useAccount:createUseAccount(web3,provider),
    useNetwork:createUseNetwork(web3,provider),
    useListedNft:createUseListedNft(contract),
    useOwnedNft:createOwnedNft(contract)
   }
}











