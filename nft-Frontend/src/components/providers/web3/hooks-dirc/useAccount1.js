
import { useEffect} from "react"
import useSWR from "swr"

export const handler = (web3, provider) => () => {
  
    const { mutate, ...rest } = useSWR(() =>{
     return web3 ? "web3/accounts" : null },

      async () => {
          const accounts = await web3.listAccounts();
        return accounts[0]
      }
    )
    useEffect(() => {
      provider &&
      provider.on("accountsChanged",
        accounts => mutate(accounts[0] ?? null)
      
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider])
    return { 
        mutate,
        ...rest
    }
  }
   
















