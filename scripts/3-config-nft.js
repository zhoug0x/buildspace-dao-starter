import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

// bundle drop address from previous deploy-drop script
const bundleDrop = sdk.getBundleDropModule(
	'0x160A1F9488d3eB7f14aC9db50D3d3A8019f8B2cC'
);

(async () => {
	try {
		await bundleDrop.createBatch([
			{
				name: 'Master & Commander DAO Membership',
				description: 'This NFT will give you access to Master & Commander DAO!',
				image: readFileSync('scripts/assets/nft-img.png'),
			},
		]);
		console.log('✅ Successfully created a new NFT in the drop!');
	} catch (error) {
		console.error('failed to create the new NFT', error);
	}
})();
