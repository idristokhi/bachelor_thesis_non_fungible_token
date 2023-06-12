
import React from "react"
import { isUndefined } from "swr/_internal"
import Item from "../Item/Nft-Item"
import "../Navbar/NavigationBar"
import { useListedNft } from "../web3/hooks"



const ListNft=()=>{
  const {listed}=useListedNft()
if(!isUndefined(listed.data)){
    return(

        <div className="mt-5  grid gap-2 lg:grid-cols-4 lg:max-w-none lg:max-h-none">
        {listed.data.map((nft) =>{
          const jsonObj = JSON.parse(nft.meta);
          jsonObj.price = nft.price;
          jsonObj.tokenId = nft.tokenId;

          console.log(jsonObj)
            return (
                <div key={nft.meta.name} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <Item
                nft={jsonObj}
                buyNft={listed.buyNft}
              />
           </div>
            )
        }
        )}
      </div>
    )
}
}
export default ListNft








