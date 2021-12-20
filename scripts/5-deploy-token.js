import sdk from './1-initialize-sdk.js';

// Deployed token address
// https://rinkeby.etherscan.io/address/0xE322441D1219f540bfa5c898A7396C7C132AC4EE

// In order to deploy the new contract we need our old friend the app module again.
const app = sdk.getAppModule('0x9aE068F54917DBE7d9396b87B2B683B52BDB5f27');

(async () => {
	try {
		// Deploy a standard ERC-20 contract.
		const tokenModule = await app.deployTokenModule({
			// What's your token's name? Ex. "Ethereum"
			name: 'Master & Commander Token',
			// What's your token's symbol? Ex. "ETH"s
			symbol: 'MCMDER',
		});
		console.log(
			'✅ Successfully deployed token module, address:',
			tokenModule.address
		);
	} catch (error) {
		console.error('failed to deploy token module', error);
	}
})();
