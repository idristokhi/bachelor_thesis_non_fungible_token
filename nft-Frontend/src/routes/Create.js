/* eslint-disable jsx-a11y/anchor-is-valid */


import { useState } from 'react';
import { Switch } from '@headlessui/react'
import { NavLink } from "react-router-dom";
import { useWeb3 } from '../components/providers';
import { ethers } from "ethers"




const Create=()=>{

   const {contract}=useWeb3();
   const [nftURI, setNftURI] = useState("");
   const [nftURI2, setNftURI2] = useState("");

   const [hasURI, setHasURI] = useState(false);
   const [price, setPrice] = useState("");
   
   const [nftMeta,setNftMeta]=useState({
    name:"",
    description:"",
    image:""
   });


   const handelChange=(event)=>{
    const {name,value}=event.target;
    setNftMeta({...nftMeta,[name]:value})
   }

   const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    const imageType = imageFile.type;
    const imageSize = imageFile.size;
  
    // Check that file type is valid
    if (!imageType.startsWith("image/")) {
      alert("Please select a valid image file (e.g. PNG, JPEG).");
      return;
    }
  
    // Check that file size is within limit (1MB)
    if (imageSize > 1000000) {
      alert("Please select an image file that is smaller than 1MB.");
      return;
    }
  
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = () => {
      setNftMeta({ ...nftMeta, image: reader.result });
    };
  };
  const pinJSONToIPFS = async () => {
    const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
    const apiKey = "a5dd3ce2c01ffa4bf722";
    const apiSecret = "5ad1f9918d52b4755676e3664193df65d0bb833ae703ef3c1b93d048d7cd8a8b";
  
    const metadata = JSON.stringify(nftMeta);
  
    const response = await fetch(url, {
      method: "POST",
      mode: 'cors', // Added option to enable CORS
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
      body: JSON.stringify({
        pinataMetadata: {
          name: "My NFT Metadata",
        },
        pinataContent: metadata,
      }),
    });
  
    const { IpfsHash } = await response.json();
    setNftURI2(IpfsHash);
    return IpfsHash;
  };
  
  

  // const pinJSONToIPFS = async () => {
  //   const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
  //   const apiKey = "289052946ba6af2ad162";
  //   const apiSecret = "5fd41ff17c8604e088f0dd8071c399f016455ef6dac3fe3e6d85f1f3a693de04";
  
  //   const metadata = JSON.stringify(nftMeta);
  
  //   const response = await fetch(url, {
  
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       pinata_api_key: apiKey,
  //       pinata_secret_api_key: apiSecret,
  //     },
  //     body: JSON.stringify({
  //       pinataMetadata: {
  //         name: "My NFT Metadata",
  //       },
  //       pinataContent: metadata,
  //     }),
  //   });
  
  //   const { IpfsHash } = await response.json();
  //   setNftURI2(IpfsHash);
  //   return IpfsHash;
  // };
  
   



  const createNft=async()=>{
    // console.log(nftMeta.image,)
    await pinJSONToIPFS(nftMeta);
//    console.log(nftURI2, "nft uriiii")

    //const url = `https://gateway.pinata.cloud/ipfs/${nftURI2}`
    // console.log(url)
    const tx = await contract.mint(
      nftURI2,
        ethers.utils.parseEther(price), {
          value: ethers.utils.parseEther(0.025.toString())
        }
      );

      await tx.wait();
      alert("Nft was created!");
  }
    return(
     <>
     <div className="create">
     <div>
        <div className="py-4">
          { !nftURI &&
            <div className="flex">
              <div className="mr-2 font-bold underline">Do you have meta data already?</div>
              <Switch
                checked={hasURI}
                onChange={() => setHasURI(!hasURI)}
                className={`${hasURI ? 'bg-indigo-900' : 'bg-indigo-700'}
                  relative inline-flex flex-shrink-0 h-[28px] w-[64px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${hasURI ? 'translate-x-9' : 'translate-x-0'}
                    pointer-events-none inline-block h-[24px] w-[24px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                />
              </Switch>
            </div>
          }
        </div>
        { (nftURI || hasURI) ?
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">List NFT</h3>
                <p className="mt-1 text-sm text-gray-600">
                  This information will be displayed publicly so be careful what you share.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  { hasURI &&
                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                      <div>
                        <label htmlFor="uri" className="block text-sm font-medium text-gray-700">
                          URI Link
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                          value={nftURI2}
                            type="text"
                            name="uri"
                            id="uri"
                            readOnly
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="http://link.com/data.json"
                          />
                  
                        </div>
                      </div>
                    </div>
                  }
                  { nftURI &&
                    <div className='mb-4 p-4'>
                      <div className="font-bold">Your metadata: </div>
                      <div>
                        <NavLink href={nftURI}>
                          <a className="underline text-indigo-600">
                            {nftURI}
                          </a>
                        </NavLink>
                      </div>
                    </div>
                  }
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price (ETH)
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          onChange={(e) => setPrice(e.target.value.toString())}
                          value={price}
                          type="number"
                          name="price"
                          id="price"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          placeholder="0.8"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                     onClick={createNft}
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      List
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        :
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Create NFT Metadata</h3>
              <p className="mt-1 text-sm text-gray-600">
                This information will be displayed publicly so be careful what you share.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                      value={nftMeta.name}
                      onChange={handelChange}
                        type="text"
                        name="name"
                        id="name"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                        placeholder="My Nice NFT"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                      value={nftMeta.description}
                       onChange={handelChange}
                        id="description" 
                        name="description"
                        rows={3}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="Some nft description..."
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description of NFT
                    </p>
                  </div>
                  {/* Has Image? */}
                  { nftMeta.image ?
                    <img src={nftMeta.image} alt="" className="h-40" /> :
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Cover photo</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                        <label
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                    
                            <input
                             type="file"
                             accept="image/*"
                             onChange={handleImageChange}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  }
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    onClick={pinJSONToIPFS}
                    type="button"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    List
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        }
      </div>
    </div>
    </>
   
    )
}

export default Create

