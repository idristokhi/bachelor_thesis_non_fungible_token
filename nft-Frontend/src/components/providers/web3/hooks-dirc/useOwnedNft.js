import useSWR from "swr"
import { ethers } from "ethers"
import { useCallback } from "react"

export const handler = (contract) => () => {
     const {data,...swrRes}=useSWR(()=>
  contract ? "web3/OwnedNft" : "null",
  async()=>{
    const nfts=[];
    const ownedNft=await contract.getOwnedNfts();  
    for(let i=0;i<ownedNft.length;i++){
        const item=ownedNft[i];
        const tokenURI=await contract.tokenURI(item.tokenId);
        const url = `https://gateway.pinata.cloud/ipfs/${tokenURI}`
        const requestOptions = {
            method: 'GET',
             "Access-Control-Allow-Origin" : "http://localhost:3000"
        }
        const metaRes=await fetch(url, requestOptions);
        const meta=await metaRes.json();
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

  const _contract=contract;
  const ListNft =useCallback( async(tokenId,price)=>{
   
    try{
        const result= await contract.PlaceNftOnsale(
            tokenId,
            ethers.utils.parseEther(price.toString()),
            {
                value:ethers.utils.parseEther(0.025.toString())
            }
        )
        await result.wait();

        alert("NFT has been listed")

    }catch(e){
       console.error(e.message)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[_contract])
  

  return {
    data,
    ListNft,
    ...swrRes,
}
}






















