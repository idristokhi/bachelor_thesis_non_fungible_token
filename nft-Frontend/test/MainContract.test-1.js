/* eslint-disable no-undef */
 
const NftMarket=artifacts.require("MainContract");
const {ethers}=require("ethers");

contract("NftMarket",accounts=>{
    let _contract=null;

    let _nftPrice=ethers.utils.parseEther("0.3").toString();
    let listingPrice=ethers.utils.parseEther("0.025").toString();


    before(async()=>{

     _contract=await NftMarket.deployed();
     //console.log(accounts);
    })

    describe("Mint token",()=>{
        const tokenURI ="https://test.com";
        before(async () =>{
            await _contract.mint(tokenURI,_nftPrice,{
                from:accounts[0],
                value:listingPrice})})
        it("owner of first token should be address[0]",async()=>{
            const owner =await _contract.ownerOf(1);
            assert(owner == accounts[0],"Owner of token is not matching address[0]");
        })
        it("first token should point to the correct tokenURI",async()=>{
            const actualTokenURI =await _contract.tokenURI(1);
            assert(actualTokenURI,tokenURI,"tokenURI IS NOT correctly set");
        })
        it("should not be possible to create a NFT with used tokenURI",async()=>{
            try {
                await _contract.mint(tokenURI,_nftPrice,{
                    from:accounts[0]
                })
            } catch (error) {
               assert(error,"Nft was minted with previously used tokenURI");
            } })
        it("should have one listed item",async()=>{
            const listedItemC=await _contract.getListedItemCount();
            assert(listedItemC.toNumber(),"listed item count is not 1");
        })
        it("should have created nftItem",async()=>{
            const nftItem=await _contract.getNftItem(1);
            console.log(nftItem);
            assert(nftItem.tokenId,1," token id is not 1");
            assert(nftItem.price,_nftPrice," Nft price is not correct");
            assert(nftItem.creator,accounts[0]," Creator is not account[0]");
            assert(nftItem.isListed,true,"token is not listed");
        })
    })



    describe("buyNft",()=>{

       before(async () => {
          
       await _contract.buyNft(1,{
        from:accounts[1],
        value:_nftPrice
       })
       })
       it("should unlist the item", async()=>{
        const listedItem=await _contract.getNftItem(1);
        assert.equal(listedItem.isListed,false,"items is still listed");

       })

       it("should decrease the listed item count",async()=>{
        const listedItemC=await _contract.getListedItemCount();
        assert.equal(listedItemC.toNumber(),0,"the item Count is still the same");
       })

       it("should change the owner",async () => {
        const currentOwner=await _contract.ownerOf(1);
        assert.equal(currentOwner,accounts[1],"the owner is still the same");
         
       })


    })

    describe("token Transfer", ()=>{
        const tokenURI="https://test.json";
        before(async()=>{
            await _contract.mint(tokenURI,_nftPrice,{
                from:accounts[0],
                value:listingPrice})})
            it("should have two nfts created", async()=>{
               const totalS=await _contract.totalSupply();
               assert.equal(totalS.toNumber(),2,"totalsupply of token is not correct");
            })
            it("should have retrive nfts by index", async()=>{
                const index=await _contract.tokenByIndex(0);
                const index1=await _contract.tokenByIndex(1);
                assert.equal(index.toNumber(),1,"nft id is wrong");
                assert.equal(index1.toNumber(),2,"nft id is worong");
             })
             it("should have one listed Nft", async()=>{
                const allNftSale=await _contract.getAllNftOnSale();
                console.log(allNftSale[0].tokenId);
                assert(allNftSale[0].tokenId,2,"Nft have a wrong Id");
             })
             it("account[1] should have one owned Nft",async()=>{
                const OwnedNft=await _contract.getOwnedNfts({from:accounts[1]});
                //console.log(OwnedNft)
                assert(OwnedNft[0].tokenId,1,"rtgertg");
             })
             it("accounts[0] should have One owned Nft",async()=>{
                const ownedNft=await _contract.getOwnedNfts({from:accounts[0]});
                //console.log(ownedNft)
                assert(ownedNft[0].tokenId,2,"rfggftgerff");
             })
    })



    
    describe("Token Transfer to new Owner",() =>{

        before(async () => {
            await _contract.transferFrom(
            accounts[0],
            accounts[1],
            2
            )
        })
        it("account[0] should own 0 Nft",async()=>{
            const OwnedNft=await _contract.getOwnedNfts({from:accounts[0]});
            console.log(OwnedNft);
            assert.equal(OwnedNft.length,0,"ggggg");
         })
         it("account[1] should own 2 Nft",async()=>{
            const OwnedNft=await _contract.getOwnedNfts({from:accounts[1]});
            console.log(OwnedNft);
            assert.equal(OwnedNft.length,2,"dddd");
         })


    })


   /* describe("Burn Token",()=>{

        const tokenURI="https://test222.json";
        before(async()=>{
            await _contract.mint(tokenURI,_nftPrice,{
                from:accounts[2],
                value:listingPrice
            })
        })
        it("account[2] should have one owned Nft",async()=>{
            const ownedNft=await _contract. getOwnedNfts({from:accounts[2]});
            //console.log(OwnedNft)
            assert(ownedNft[0].tokenId,3,"rtgertg");
         })

         it("account[2] should own 0 Nft",async()=>{
            await _contract.BurnToken(3,{from:accounts[2]});
            const ownedNft=await _contract.getOwnedNfts({from:accounts[2]});
            //console.log(OwnedNft)
            assert.equal(ownedNft.length,0,"Invalid length");
         })
    })
    */

    describe("List an Nft",()=>{

        before(async()=>{
            await _contract.PlaceNftOnsale(
                1,
                _nftPrice,{from:accounts[1],value:listingPrice}
            )
        })

        it("should have two listed Item",async()=>{
            const listedNft=await _contract.getAllNftOnSale();

            console.log(listedNft)
            assert.equal(listedNft.length,2," Invalid Length");
        })

        it("should set222 new listing price",async()=>{
            await _contract.setListingPrice(listingPrice);

            const setPrice=await _contract.listingPrice();
            assert.equal(setPrice.toString(),listingPrice," Invalid Length");
        })
    })

})
























































































