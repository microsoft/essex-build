module.exports = {
	presets: [
		[require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
		[
			require.resolve('@babel/preset-env'),
			{
				targets: {
					esmodules: true,
				},
			},
		],
		[require.resolve('@babel/preset-typescript'), {}],
	],
}
