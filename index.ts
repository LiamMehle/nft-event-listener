// ethersSetup.ts
import { ethers } from 'ethers';
import nftAbi from './shyTokenAbi.js';
import mariadb from 'mariadb';

console.log('init');
const pool = mariadb.createPool({
    host: 'localhost', 
    user:'root',
    password: '1234',
    connectionLimit: 1,
    database: 'nft'
});

console.log('connecting');
const dbConnection = await pool.getConnection();

// Use the Infura provider
const provider = new ethers.InfuraProvider('sepolia', process.env.INFURA_API_KEY);
const contractAddress = process.env.CONTRACT_ADDRESS;
if (contractAddress === undefined)
    throw "undefined CONTRACT_ADDRESS"

const contract = new ethers.Contract(contractAddress, nftAbi, provider);
const processedTxs = new Set<string>();

contract.on("event TokenMinted(uint id)", (id, event: ethers.EventLog) => {
    if (processedTxs.has(event.transactionHash))
        return;
    processedTxs.add(event.transactionHash);
    console.log(`Token minted with ID ${id}`);
    event.getTransactionReceipt().then(receipt => {
        const to = receipt.from.replace('0x', '');
        dbConnection.execute(`INSERT INTO \`events\` (eventType, newOwner) VALUES ("TokenMinted", "${to}");`);
    });
});
contract.on("event TokenGiven(address from, address to, uint id)", (from: string, to: string, id: string, event: ethers.EventLog) => {
    if (processedTxs.has(event.transactionHash))
        return;
    processedTxs.add(event.transactionHash);
    console.log(`Token ${id} given by ${from} to ${to}`);
    from = from.replace('0x', '');
    to   =   to.replace('0x', '');
    dbConnection.execute(`INSERT INTO \`events\` (eventType, token, previousOwner, newOwner) VALUES ("TokenGiven", ${id}, "${from}", "${to}");`);
});
contract.on("event TokenDestroyed(uint id)", (id, event: ethers.EventLog) => {
    if (processedTxs.has(event.transactionHash))
        return;
    processedTxs.add(event.transactionHash);
    console.log(`Token ${id} destroyed`);
    event.getTransactionReceipt().then(receipt => {
        const from = receipt.from.replace('0x', '');
        dbConnection.execute(`INSERT INTO \`events\` (eventType, token, previousOwner) VALUES ("TokenGiven", ${id}, "${from}");`);
    });
});