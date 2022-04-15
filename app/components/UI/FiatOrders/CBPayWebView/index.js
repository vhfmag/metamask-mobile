import React, { memo, useCallback, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, InteractionManager, Platform } from 'react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';

import { getTransakWebviewNavbar } from '../../Navbar';
import { baseStyles } from '../../../../styles/common';
import AnalyticsV2 from '../../../../util/analyticsV2';
import { FIAT_ORDER_PROVIDERS, PAYMENT_CATEGORY, PAYMENT_RAILS } from '../../../../constants/on-ramp';
import { ThemeContext, mockTheme } from '../../../../util/theme';

// eslint-disable-next-line prefer-arrow-callback
const CBPayWebViewFn = memo(function CBPayWebViewFn({ navigation, selectedAddress, route }) {
	const theme = useContext(ThemeContext);
	const webviewSource = useMemo(() => {
		const appId = 'wallet';

		const url = new URL(`https://${process.env.CBPAY_HOST}/buy/select-asset`);
		url.searchParams.append('appId', appId);
		url.searchParams.append('destinationWallets', JSON.stringify({ [selectedAddress]: ['ethereum'] }));

		return { uri: url.toString() };
	}, [selectedAddress]);

	const goBackToHome = useCallback(() => {
		const parentNavigation = navigation.dangerouslyGetParent() || navigation;
		parentNavigation.popToTop();
	}, [navigation]);
	const goBackToPaymentMethodSelection = useCallback(() => navigation.pop(), [navigation]);

	useEffect(() => {
		const colors = theme.colors || mockTheme.colors;
		navigation.setOptions(
			getTransakWebviewNavbar(
				navigation,
				route,
				() => {
					InteractionManager.runAfterInteractions(() => {
						AnalyticsV2.trackEvent(AnalyticsV2.ANALYTICS_EVENTS.ONRAMP_PURCHASE_EXITED, {
							payment_rails: PAYMENT_RAILS.MULTIPLE,
							payment_category: PAYMENT_CATEGORY.MULTIPLE,
							'on-ramp_provider': FIAT_ORDER_PROVIDERS.CBPAY,
						});
					});
				},
				colors
			)
		);
	}, [navigation, route, theme.colors]);

	useEffect(() => {
		if (Platform.OS === 'android') {
			InAppBrowser.open(webviewSource.uri, { showTitle: true }).then((result) => {
				if (result.type === 'dismiss') {
					goBackToHome();
				} else {
					goBackToPaymentMethodSelection();
				}
			});
		}

		return () => {
			if (Platform.OS === 'android') {
				InAppBrowser.close();
			}
		};
	}, [webviewSource.uri, goBackToHome, goBackToPaymentMethodSelection]);

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={baseStyles.flexGrow}>
			{Platform.OS === 'ios' && (
				<WebView
					source={webviewSource}
					thirdPartyCookiesEnabled
					sharedCookiesEnabled
					onMessage={(event) => {
						try {
							const { data } = JSON.parse(event.nativeEvent.data);
							if (data.eventName === 'exit') {
								goBackToHome();
							}
						} catch (error) {
							console.error(error);
						}
					}}
					injectedJavaScriptForMainFrameOnly
					injectedJavaScriptBeforeContentLoadedForMainFrameOnly
					injectedJavaScriptBeforeContentLoaded={`
						const postMessage = (...args) => window.ReactNativeWebView.postMessage(...args);

						Object.assign(window, { postMessage });
						// The assign is here so that window.self !== window.parent
						window.parent = Object.assign({}, window.parent);
					`}
				/>
			)}
		</KeyboardAvoidingView>
	);
});

CBPayWebViewFn.propTypes = {
	navigation: PropTypes.object,
	/**
	 * Selected address
	 */
	selectedAddress: PropTypes.string,
	/**
	 * Object that represents the current route info like params passed to it
	 */
	route: PropTypes.object,
};

CBPayWebViewFn.navigationOptions = () => ({ headerTitle: 'Coinbase Pay' });

const mapStateToProps = (state) => ({
	selectedAddress: state.engine.backgroundState.PreferencesController.selectedAddress,
});

export default connect(mapStateToProps)(CBPayWebViewFn);
