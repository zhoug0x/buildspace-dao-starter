import { ThirdwebSDK } from '@3rdweb/sdk';
import ethers from 'ethers';

//Importing and configuring our .env file that we use to securely store our environment variables
import dotenv from 'dotenv';
dotenv.config();

// Some quick checks to make sure our .env is working.
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == '') {
	console.log('🛑 Private key not found.');
}

if (!process.env.NODE_URL || process.env.NODE_URL == '') {
	console.log('🛑 Ethereum node URL not found.');
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == '') {
	console.log('🛑 Wallet Address not found.');
}

// instantiate thirdweb SDK with private key & ethers provider
const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const sdk = new ThirdwebSDK(wallet);

(async () => {
	try {
		const apps = await sdk.getApps();
		console.log('amt of apps: ', apps.length);
		console.log('Your app address is:', apps[0]?.address);
	} catch (err) {
		console.error('Failed to get apps from the sdk', err);
		process.exit(1);
	}
})();

// We are exporting the initialized thirdweb SDK so that we can use it in our other scripts
export default sdk;
