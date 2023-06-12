import { useHooks } from "../../providers/web3"


const enhanceHook=(swrResponse)=>{
   return{
      ...swrResponse,
      hasFirstResponse:swrResponse.data || swrResponse.error
   }
}

export const useAccount=()=>{
   const swrResponse=enhanceHook (useHooks((hooks)=>hooks.useAccount)())
   return{
      account:swrResponse
   }
}

export const useNetwork=()=>{
   const swrResponse=enhanceHook(useHooks((hooks)=>hooks.useNetwork)()) 
   return{
      network:swrResponse
   }
}

export const useListedNft=()=>{
   const swrResponse=enhanceHook(useHooks((hooks)=>hooks.useListedNft)()) 
   return{
      listed:swrResponse
   }
}

export const useOwnedNft=()=>{
   const swrResponse=enhanceHook(useHooks((hooks)=>hooks.useOwnedNft)()) 
   return{
      ownedNft:swrResponse
   }
}



























