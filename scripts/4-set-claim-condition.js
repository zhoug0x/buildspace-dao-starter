import sdk from './1-initialize-sdk.js';

const bundleDrop = sdk.getBundleDropModule(
	'0x160A1F9488d3eB7f14aC9db50D3d3A8019f8B2cC'
);

(async () => {
	try {
		const claimConditionFactory = bundleDrop.getClaimConditionFactory();
		// Specify conditions.
		claimConditionFactory.newClaimPhase({
			startTime: new Date(),
			maxQuantity: 50_000,
			maxQuantityPerTransaction: 1,
		});

		await bundleDrop.setClaimCondition(0, claimConditionFactory);
		console.log('✅ Sucessfully set claim condition!');
	} catch (error) {
		console.error('Failed to set claim condition', error);
	}
})();
