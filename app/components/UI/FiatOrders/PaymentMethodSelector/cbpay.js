import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View } from 'react-native';

import PaymentMethod from '../components/PaymentMethod';
import Title from '../../../Base/Title';
import Text from '../../../Base/Text';

const styles = StyleSheet.create({
	title: {
		flex: 1,
		flexWrap: 'wrap',
	},
	logo: {
		marginVertical: 5,
		aspectRatio: 154 / 86,
		width: undefined,
		height: 40,
	},
});

/* eslint-disable import/no-commonjs */
const CBPayLogoSrc = require('../../../../images/CBpay-logo.png');
/* eslint-enable import/no-commonjs */

const CBPayPaymentMethod = ({ onPress, ticker, chainId }) => (
	<PaymentMethod onPress={onPress}>
		<PaymentMethod.Content>
			{/* eslint-disable-next-line react-native/no-inline-styles */}
			<View style={{ display: 'flex', flexDirection: 'row' }}>
				{/* eslint-disable-next-line react-native/no-inline-styles */}
				<View style={{ flex: 1 }}>
					<Title style={styles.title}>Buy with Coinbase</Title>
					<Text>You can easily buy or transfer crypto with your Coinbase account</Text>
				</View>

				<Image source={CBPayLogoSrc} style={styles.logo} />
			</View>
		</PaymentMethod.Content>
	</PaymentMethod>
);

CBPayPaymentMethod.propTypes = {
	onPress: PropTypes.func,
	ticker: PropTypes.string,
	chainId: PropTypes.string,
};
CBPayPaymentMethod.defaultProps = {
	onPress: undefined,
};

export default CBPayPaymentMethod;
