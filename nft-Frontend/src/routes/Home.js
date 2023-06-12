import React from "react";

import "../components/Navbar/NavigationBar"

import ListNft from "../components/List/Nft-List";



const Home = () => {
  return (
    <>
      <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl mb-4">Amazing Creatures NFTs</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-500">Get ownership of a unique NFT</p>
          </div>
          <ListNft/>
        </div>
      </div>
      <style>{`
        h2 {
          text-shadow: 1px 1px #ccc;
        }
        p {
          font-style: italic;
        }
      `}</style>
    </>
  );
};

export default Home;

