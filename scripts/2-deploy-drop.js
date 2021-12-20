import { ethers } from 'ethers';
import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

// current ERC-1155 deploy:
// 0x160A1F9488d3eB7f14aC9db50D3d3A8019f8B2cC
// https://rinkeby.etherscan.io/address/0x160A1F9488d3eB7f14aC9db50D3d3A8019f8B2cC

// img on ipfs: 
// ipfs://bafkreicia5jhfdo5b32rnxcxqfq7y4hsph3pffhc27hve27ktjgk3h642q

const app = sdk.getAppModule('0x9aE068F54917DBE7d9396b87B2B683B52BDB5f27');

(async () => {
	try {
		const bundleDropModule = await app.deployBundleDropModule({
			// The collection's name, ex. CryptoPunks
			name: 'Master & Commander DAO Membership',
			// A description for the collection.
			description: 'One token represents membership to Master & Commander DAO!',
			// The image for the collection that will show up on OpenSea.
			image: readFileSync('scripts/assets/nft-img.png'),
			// We need to pass in the address of the person who will be receiving the proceeds from sales of nfts in the module.
			// We're planning on not charging people for the drop, so we'll pass in the 0x0 address
			// you can set this to your own wallet address if you want to charge for the drop.
			primarySaleRecipientAddress: ethers.constants.AddressZero,
		});

		console.log(
			'✅ Successfully deployed bundleDrop module, address:',
			bundleDropModule.address
		);
		console.log(
			'✅ bundleDrop metadata:',
			await bundleDropModule.getMetadata()
		);
	} catch (error) {
		console.log('failed to deploy bundleDrop module', error);
	}
})();
