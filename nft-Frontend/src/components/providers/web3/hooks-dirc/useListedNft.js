
import {ethers} from "ethers"
import { useCallback } from "react";
import useSWR from "swr"



export const handler = (contract) => () => {
  
 
  const {data,...swrRes}=useSWR(()=>
  contract ? "web3/listeNft" : "null",
   async()=>{
    const nfts=[];
    const listed=await contract.getAllNftOnSale();

   //console.log(listed,"i am here listing all nfts")
    for(let i=0;i<listed.length;i++){
        const item=listed[i];
        const tokenURI=await contract.tokenURI(item.tokenId);
        const url = `https://gateway.pinata.cloud/ipfs/${tokenURI}`
        
        const metaRes=await fetch(url);
        // console.log(metaRes, "meta Response dadadasd")
        const meta=await metaRes.json();
        // console.log("dasds")
        console.log(meta, "meta issss")
        // https://gateway.pinata.cloud/ipfs/

        nfts.push({
            price:parseFloat(ethers.utils.formatEther(item.price)),
            tokenId:item.tokenId.toNumber(),
            creator:item.creator,
            isListed:item.isListed,
            meta
        })
    }
    
    return nfts
   }

  )
  const _contract=contract
  const buyNft =useCallback( async(tokenId,value)=>{
    console.log(contract,"h")
    console.log(tokenId, "value")

    try{
            if (!value) {
                 throw new Error("Invalid value");
    }
    if (typeof value === "undefined" || isNaN(value)) {
        console.error("Invalid value for buyNft function.");
        return;
      }

      console.log(value.toString())
        const result= await contract.buyNft(
            tokenId,{
                value:ethers.utils.parseEther(value.toString())
            }
        )

          
          console.log(result);
        await result.wait();

        alert("you have bought nft check your profile")

    }catch(e){
       console.error(e.message)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[_contract])
  return {
    data,
    buyNft,
    ...swrRes,
}
}
























