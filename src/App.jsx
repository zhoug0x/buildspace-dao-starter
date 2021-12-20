import { useEffect, useMemo, useState } from 'react';
import { useWeb3 } from '@3rdweb/hooks';
import { ThirdwebSDK } from '@3rdweb/sdk';


// Rinkeby contract
// https://rinkeby.etherscan.io/address/0x160a1f9488d3eb7f14ac9db50d3d3a8019f8b2cc

// Membership NFT on OS
// https://testnets.opensea.io/collection/master-commander-dao-membership
// https://testnets.opensea.io/assets/0x160A1F9488d3eB7f14aC9db50D3d3A8019f8B2cC/0


const sdk = new ThirdwebSDK('rinkeby');
const bundleDropModule = sdk.getBundleDropModule(
	'0x160A1F9488d3eB7f14aC9db50D3d3A8019f8B2cC'
);

const App = () => {
	const { connectWallet, address, error, provider } = useWeb3();
	const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

	const signer = provider ? provider.getSigner() : undefined;
	const [isClaiming, setIsClaiming] = useState(false);

	// Load signer into thirdweb sdk
	useEffect(() => {
		sdk.setProviderOrSigner(signer);
	}, [signer]);

	// On load, check if user has membership NFT in their connected wallet
	useEffect(() => {
		// If they don't have an connected wallet, exit!
		if (!address) {
			return;
		}

		// Check if the user has the NFT by using bundleDropModule.balanceOf
		return bundleDropModule
			.balanceOf(address, '0')
			.then(balance => {
				// If balance is greater than 0, they have our NFT!
				if (balance.gt(0)) {
					setHasClaimedNFT(true);
					console.log('🌟 this user has a membership NFT!');
				} else {
					setHasClaimedNFT(false);
					console.log("😭 this user doesn't have a membership NFT.");
				}
			})
			.catch(error => {
				setHasClaimedNFT(false);
				console.error('failed to nft balance', error);
			});
	}, [address]);

	const mintNft = () => {
		setIsClaiming(true);
		bundleDropModule
			.claim('0', 1)
			.catch(err => {
				console.error('failed to claim', err);
				setIsClaiming(false);
			})
			.finally(() => {
				setIsClaiming(false);
				setHasClaimedNFT(true);
				console.log(
					`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
				);
			});
	};

	// User's wallet not connected, render prompt
	if (!address) {
		return (
			<div className='landing'>
				<h1>Welcome to Master &amp; Commander DAO</h1>
				<button onClick={() => connectWallet('injected')} className='btn-hero'>
					Connect your wallet, landlubber!
				</button>
			</div>
		);
	}

	// User is has a membership NFT in their wallet
	if (hasClaimedNFT) {
		return (
			<div className='member-page'>
				<h1>🍪DAO Member Page</h1>
				<p>Congratulations on being a member</p>
			</div>
		);
	}

	// User has no membership, render minting UI
	return (
		<div className='mint-nft'>
			<h1>Mint your free 🍪DAO Membership NFT</h1>
			<button disabled={isClaiming} onClick={() => mintNft()}>
				{isClaiming ? 'Minting...' : 'Mint your nft (FREE)'}
			</button>
		</div>
	);
};

export default App;
