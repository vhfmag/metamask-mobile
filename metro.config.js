
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require("metro-config");
const { resolver: defaultResolver } = getDefaultConfig.getDefaultValues();

module.exports = {
	resolver : {
		...defaultResolver,
		sourceExts: [
			...defaultResolver.sourceExts,
			'cjs',
		],
	},
	transformer: {
		getTransformOptions: async () => ({
			transform: {
				experimentalImportSupport: true,
				inlineRequires: true,
			},
		}),
		assetPlugins: ['react-native-svg-asset-plugin'],
		svgAssetPlugin: {
			pngCacheDir: '.png-cache',
			scales: [1],
			output: {
			  compressionLevel: 6,
			},
		  },
	},
	maxWorkers: 2
};
