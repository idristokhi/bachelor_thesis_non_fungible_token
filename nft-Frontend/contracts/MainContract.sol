// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
 

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract MainContract is ERC721URIStorage,Ownable{
   using Counters for Counters.Counter;

   // all nfts array
   uint256[] private _allNft;
   mapping(uint=>uint)private _idToNftIndex;



   uint public listingPrice = 0.025 ether;
   Counters.Counter private _listItem;
   Counters.Counter private _tokenId;


   mapping(string => bool)private usedTokenURI;
   mapping(uint => NftItem) private _idToNftItem;


   mapping(address=>mapping(uint=>uint))private _ownedTokens;
   mapping(uint=>uint)private _idToOwnedIndex;



   struct NftItem{
    uint tokenId;
    uint price;
    address creator;
    bool isListed;
   }

   event NftItemCreated(
    uint tokenId,
    uint price,
    address creator,
    bool isListed
   );

  constructor()ERC721("GreenNft"," GNFT"){}

  //function BurnToken(uint tokenId)public {
    //_burn(tokenId);
  //}

  function setListingPrice(uint newPrice)external onlyOwner{
    require(newPrice > 0," price must be at least 1 wei");
    listingPrice =newPrice;
  }

  function mint(string memory tokenURI, uint price)public payable returns(uint){
    require(!tokenURIExists(tokenURI),"Token URI already Exists");
    require(msg.value == listingPrice, " price must be equal to listingPrice");

    _tokenId.increment();
    _listItem.increment();

    uint newTokenId=_tokenId.current();
    _safeMint(msg.sender,newTokenId);
    _setTokenURI(newTokenId,tokenURI);
    usedTokenURI[tokenURI]=true;
    createNftItem(newTokenId, price);

    return newTokenId;
  }

 


  function buyNft(uint tokenId)public payable{
    uint price = _idToNftItem[tokenId].price;
    address owner=ERC721.ownerOf(tokenId);
    require(msg.sender!=owner,"u already own this Nft");
    require(msg.value==price,"please sumbmit the asking price");

    _idToNftItem[tokenId].isListed =false;
    _listItem.decrement();
    _transfer(owner,msg.sender, tokenId);
    payable(owner).transfer(msg.value);

  }

  function PlaceNftOnsale(uint tokenId,uint newPrice)public payable{
    require(ERC721.ownerOf(tokenId)==msg.sender,"You are not owner of this Nft");
    require(_idToNftItem[tokenId].isListed==false,"Item is already on sale");
    require(msg.value == listingPrice,"price must be equal to listing price");


    _idToNftItem[tokenId].isListed=true;
    _idToNftItem[tokenId].price=newPrice;
    _listItem.increment();

    
  } 



  function createNftItem(uint tokenId, uint price)private{
      require(price > 0, " price should be least 1 wei ");
      _idToNftItem[tokenId]=NftItem(
        tokenId,
        price,
        msg.sender,
        true
      );

      emit NftItemCreated(tokenId, price, msg.sender, true);
  }

  function totalSupply()public view returns(uint){

    return _allNft.length;
  }

  function tokenByIndex(uint index)public view returns(uint){
    require(index<totalSupply()," Index out of the bounds" );
    return _allNft[index];
  }

  function tokenOfOwnerByIndex(address owner,uint index)public view returns(uint){
    require(index<ERC721.balanceOf(owner),"index out of bounds" );
    return _ownedTokens[owner][index];
  }

  function getOwnedNfts()public view returns(NftItem[]memory){
    uint ownedItemsCount=ERC721.balanceOf(msg.sender);
    NftItem[] memory items=new NftItem[](ownedItemsCount);
    

    for(uint i=0;i<ownedItemsCount;i++){
      uint tokenId=tokenOfOwnerByIndex(msg.sender,i);
      NftItem storage item=_idToNftItem[tokenId];
      items[i]=item;
    }
    return items; 

  }

  function getAllNftOnSale()public view returns(NftItem[] memory){
    uint allItemsCount=totalSupply();
    uint currentindex=0;
    NftItem[]memory items=new NftItem[](_listItem.current());

    for(uint i=0;i<allItemsCount;i++){
      uint tokenId=tokenByIndex(i);
      NftItem storage item=_idToNftItem[tokenId];
      if(item.isListed==true){
        items[currentindex]=item;
        currentindex+=1;

      }
    }
    return items;
  }
  

  


  function _beforeTokenTransfer(address from,address to,uint tokenId,uint data)internal virtual override{
    super._beforeTokenTransfer(from,to,tokenId,data);


    if(from == address(0)){
        addTokenToAllEnumeration(tokenId);
    }
    else if(from!=to){
      removeTokenFromOwnerEnumeration(from, tokenId);
    }
    if(to==address(0)){
      removeTokenFromAllTokenEnumeration(tokenId);
    }
    else if(to!=from){
      addTokenToOwnerEnumeration(to, tokenId);
    }
  }


  function addTokenToAllEnumeration(uint tokenId)private{
    _idToNftIndex[tokenId]=_allNft.length;
    _allNft.push(tokenId);
  }
  function addTokenToOwnerEnumeration(address to,uint tokenId)private{
    uint length=ERC721.balanceOf(to);
    _ownedTokens[to][length]=tokenId;
    _idToOwnedIndex[tokenId]=length;
  }


  function removeTokenFromOwnerEnumeration(address from,uint tokenId)public{
       uint LastTokenIndex=ERC721.balanceOf(from)-1;
       uint tokenIndex=_idToOwnedIndex[tokenId];
       if(tokenIndex!=LastTokenIndex){
        uint LastTokenId=_ownedTokens[from][LastTokenIndex];
        _ownedTokens[from][tokenIndex]=LastTokenId;
        _idToOwnedIndex[LastTokenId]=tokenIndex;
       }
       delete _idToOwnedIndex[tokenId];
       delete _ownedTokens[from][LastTokenIndex];
    
  }

  function removeTokenFromAllTokenEnumeration(uint tokenId)private{
    uint lastTokenIndex=_allNft.length-1;
    uint tokenIndex=_idToNftIndex[tokenId];
    uint lastTokenId=_allNft[lastTokenIndex];

    _allNft[tokenIndex]=lastTokenId;
    _idToNftIndex[lastTokenId]=tokenIndex;

    delete _idToNftIndex[tokenId];
    _allNft.pop();

  }

  function getNftItem(uint tokenId )public view returns(NftItem memory){
    return _idToNftItem[tokenId];
  }

  function getListedItemCount()public view returns(uint){
    return _listItem.current();
  }

  function tokenURIExists(string memory tokenURI)public view returns(bool) {
    return usedTokenURI[tokenURI]==true;
  }
}



















