import sdk from './1-initialize-sdk.js';

// Deployed voting contract
// https://rinkeby.etherscan.io/address/0x4249467Ce555298F0c2C3fb7A259Aeb5AAfd67E3

// Grab the app module address.
const appModule = sdk.getAppModule(
	'0x9aE068F54917DBE7d9396b87B2B683B52BDB5f27'
);

(async () => {
	try {
		const voteModule = await appModule.deployVoteModule({
			// Give your governance contract a name.
			name: 'Master & Commander DAO Proposals',

			// This is the location of our governance token, our ERC-20 contract!
			votingTokenAddress: '0xE322441D1219f540bfa5c898A7396C7C132AC4EE',

			// After a proposal is created, when can members start voting?
			// For now, we set this to immediately.
			proposalStartWaitTimeInSeconds: 0,

			// How long do members have to vote on a proposal when it's created?
			// Here, we set it to 24 hours (86400 seconds)
			proposalVotingTimeInSeconds: 24 * 60 * 60,

			// A minimum votingQuorumFraction % of token must be used in the vote
			// if set to 0, one token holder can create a proposal & vote on it earning 100% of the vote
			// not rly secure so make sure to set this
			votingQuorumFraction: 0,

			// What's the minimum # of tokens a user needs to be allowed to create a proposal?
			// If set to 0, no tokens are required for a user to be allowed to create a proposal
			minimumNumberOfTokensNeededToPropose: '0',
		});

		console.log(
			'✅ Successfully deployed vote module, address:',
			voteModule.address
		);
	} catch (err) {
		console.log('Failed to deploy vote module', err);
	}
})();
