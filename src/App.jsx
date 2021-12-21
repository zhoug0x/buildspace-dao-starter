import { useEffect, useMemo, useState } from 'react';
import { useWeb3 } from '@3rdweb/hooks';
import { ThirdwebSDK } from '@3rdweb/sdk';
import { ethers } from 'ethers';

// NFT contract
// https://rinkeby.etherscan.io/address/0x160a1f9488d3eb7f14ac9db50d3d3a8019f8b2cc

// Token address
// https://rinkeby.etherscan.io/address/0xE322441D1219f540bfa5c898A7396C7C132AC4EE

// Membership NFT on OS
// https://testnets.opensea.io/collection/master-commander-dao-membership
// https://testnets.opensea.io/assets/0x160A1F9488d3eB7f14aC9db50D3d3A8019f8B2cC/0

const sdk = new ThirdwebSDK('rinkeby');
const bundleDropModule = sdk.getBundleDropModule(
	'0x160A1F9488d3eB7f14aC9db50D3d3A8019f8B2cC'
);
const tokenModule = sdk.getTokenModule(
	'0xE322441D1219f540bfa5c898A7396C7C132AC4EE'
);

const App = () => {
	const { connectWallet, address, error, provider } = useWeb3();
	const signer = provider ? provider.getSigner() : undefined;

	const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
	const [memberAddresses, setMemberAddresses] = useState([]);

	const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
	const [isClaiming, setIsClaiming] = useState(false);

	// A fancy function to shorten someones wallet address, no need to show the whole thing.
	const shortenAddress = str => {
		return str.substring(0, 6) + '...' + str.substring(str.length - 4);
	};

	// This useEffect grabs all our the addresses of our members holding our NFT.
	useEffect(() => {
		if (!hasClaimedNFT) {
			return;
		}

		// Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
		// with tokenId 0.
		bundleDropModule
			.getAllClaimerAddresses('0')
			.then(addresess => {
				console.log('🚀 Members addresses', addresess);
				setMemberAddresses(addresess);
			})
			.catch(err => {
				console.error('failed to get member list', err);
			});
	}, [hasClaimedNFT]);

	// This useEffect grabs the # of token each member holds.
	useEffect(() => {
		if (!hasClaimedNFT) {
			return;
		}

		// Grab all the balances.
		tokenModule
			.getAllHolderBalances()
			.then(amounts => {
				console.log('👜 Amounts', amounts);
				setMemberTokenAmounts(amounts);
			})
			.catch(err => {
				console.error('failed to get token amounts', err);
			});
	}, [hasClaimedNFT]);

	// Now, we combine the memberAddresses and memberTokenAmounts into a single array
	const memberList = useMemo(() => {
		return memberAddresses.map(address => ({
			address,
			tokenAmount: ethers.utils.formatUnits(
				// If the address isn't in memberTokenAmounts, it means they don't
				// hold any of our token.
				memberTokenAmounts[address] || 0,
				18
			),
		}));
	}, [memberAddresses, memberTokenAmounts]);

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
				<div>
					<div>
						<h2>Member List</h2>
						<table className='card'>
							<thead>
								<tr>
									<th>Address</th>
									<th>Token Amount</th>
								</tr>
							</thead>
							<tbody>
								{memberList.map(member => {
									return (
										<tr key={member.address}>
											<td>{shortenAddress(member.address)}</td>
											<td>{member.tokenAmount}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
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
