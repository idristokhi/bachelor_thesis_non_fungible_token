





import useSWR from "swr";

const NETWORKS = {
  1: "Ethereum Main Network",
  3: "Ropsten Test Network",
  4: "Rinkeby Test Network",
  5: "Goerli Test Network",
  42: "Kovan Test Network",
  56: "Binance Smart Chain",
  1337: "Ganache",
}
const targetNetwork = NETWORKS[process.env.REACT_APP_API_NETWORK_KEY]

export const handler = (web3) => () => {
  
  const {data,...swrRes}= useSWR(()=>{ 
    return web3 ? "web3/network" : "null"},
   async () => {
   
      if(web3){
        console.log("web3 is initia")
       }else{
        console.log("no web3")
       }

      const chainId = (await web3.getNetwork()).chainId;
      if (chainId) {
        console.log("We have ChinId.")
      }else{
        console.log("no chainId")
      }

      return NETWORKS[chainId];
      },
  )

 
  return {
   
      data,
      target:targetNetwork,
      isSupported:data===targetNetwork,
      ...swrRes
    
  }
}
















// import useSWR from "swr";

// const NETWORKS = {
//   1: "Ethereum Main Network",
//   3: "Ropsten Test Network",
//   4: "Rinkeby Test Network",
//   5: "Goerli Test Network",
//   42: "Kovan Test Network",
//   56: "Binance Smart Chain",
//   1337: "Ganache",
// }
// const targetNetwork = NETWORKS[process.env.REACT_APP_API_NETWORK_KEY]

// export const handler = (web3,provider) => () => {
  
  
//  const {data,error,...swrRes}= useSWR(()=>{
//    return web3 && provider ? "web3/network" : "null"},
//    async () => {
//       const chainId = (await web3.getNetwork()).chainId;
//       console.log(chainId,"jj")
//       if (!chainId) {
//         // eslint-disable-next-line no-throw-literal
//         throw "Cannot retreive network. Please, refresh browser or connect to other one."
//       }

//       return NETWORKS[chainId];
//     },

//   )
//   console.log(data, error,"ii")
//   return {


//   network:{
//     data,
//     isLoading: !data && !error,
//     target:targetNetwork,
//     isSupported:data===targetNetwork,
//      ...swrRes
//   }
// }
// }














