// ethersSetup.ts
import { ethers } from 'ethers';
import nftAbi from './shyTokenAbi.js';

// Use the Infura provider
const provider = new ethers.InfuraProvider('sepolia', process.env.INFURA_API_KEY);
const contractAddress = process.env.CONTRACT_ADDRESS;
if (contractAddress === undefined)
    throw "undefined CONTRACT_ADDRESS"

const contract = new ethers.Contract(contractAddress, nftAbi, provider);
const processedTxs = new Set<string>();

contract.on("event TokenMinted(uint id)", (id, event) => {
    if (processedTxs.has(event.transactionHash))
        return;
    processedTxs.add(event.transactionHash);
    console.log(`Token minted with ID ${id}`);
});
contract.on("event TokenGiven(address from, address to, uint id)", (from, to, id, event) => {
    if (processedTxs.has(event.transactionHash))
        return;
    processedTxs.add(event.transactionHash);
    console.log(`Token ${id} given by ${from} to ${to}`);
});
contract.on("event TokenDestroyed(uint id)", (id, event) => {
    if (processedTxs.has(event.transactionHash))
        return;
    processedTxs.add(event.transactionHash);
    console.log(`Token ${id} destroyed`);
});