import { NETWORKS_CHAIN_ID } from '../../../../constants/on-ramp';

const CBPAY_ALLOWED_NETWORKS = [NETWORKS_CHAIN_ID.MAINNET];
// eslint-disable-next-line import/prefer-default-export
export const isCBpayAllowedToBuy = (chainId) => CBPAY_ALLOWED_NETWORKS.includes(chainId);
