
import { Contract } from 'ethers';

const NETWORK_ID = process.env.REACT_APP_API_KEY;

export const loadContract = async (name, web3) => {
  const res = await fetch(`/contract/${name}.json`);
  const artifact = await res.json();

  const network = artifact.networks[NETWORK_ID];
  if (!network) {
    throw new Error(`Contract ${name} is not deployed on network with ID ${NETWORK_ID}`);
  }

  const contract = new Contract(network.address, artifact.abi, web3);
  
  return contract;
}
















