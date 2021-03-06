// import {
//   IOrderBookDepthSenderTypes,
//   IOrderBookReceiverTypes,
//   ITickerReceiverTypes,
//   ITickerSenderTypes,
//   ITransactionReceiverTypes,
//   ITransactionSenderTypes,
// } from '../atom/user.atom';

// import {
//   DEFAULT_ORDERBOOK_DEPTH_RECEIV_DATA,
//   DEFAULT_ORDERBOOK_DEPTH_SENDER,
//   DEFAULT_TICKER_RECEIV_DATA,
//   DEFAULT_TICKER_SENDER,
//   DEFAULT_TRANSACTION_RECEIV_DATA,
//   DEFAULT_TRANSACTION_SENDER,
// } from './defaultData';

interface ConstTypes {
  // ENABLE_KRW_SYMBOL: CoinSymbolKRWTypes[];
  // ENABLE_BTC_SYMBOL: CoinSymbolBTCTypes[];
  // DEFAULT_TICKER_SENDER: ITickerSenderTypes;
  // DEFAULT_TICKER_RECEIV_DATA: ITickerReceiverTypes;
  // DEFAULT_ORDERBOOK_DEPTH_SENDER: IOrderBookDepthSenderTypes;
  // DEFAULT_ORDERBOOK_DEPTH_RECEIV_DATA: IOrderBookReceiverTypes;
  // DEFAULT_TRANSACTION_SENDER: ITransactionSenderTypes;
  // DEFAULT_TRANSACTION_RECEIV_DATA: ITransactionReceiverTypes;
}

const CONST: ConstTypes = {
  ENABLE_KRW_SYMBOL: ['BTC_KRW', 'ETH_KRW', 'KLAY_KRW', 'XNO_KRW', 'ZIL_KRW'],
  ENABLE_BTC_SYMBOL: ['ASTA_BTC', 'BLY_BTC', 'IBP_BTC', 'LN_BTC', 'XRP_BTC'],
  // DEFAULT_TICKER_SENDER: DEFAULT_TICKER_SENDER,
  // DEFAULT_TICKER_RECEIV_DATA: DEFAULT_TICKER_RECEIV_DATA,
  // DEFAULT_ORDERBOOK_DEPTH_SENDER: DEFAULT_ORDERBOOK_DEPTH_SENDER,
  // DEFAULT_ORDERBOOK_DEPTH_RECEIV_DATA: DEFAULT_ORDERBOOK_DEPTH_RECEIV_DATA,
  // DEFAULT_TRANSACTION_SENDER: DEFAULT_TRANSACTION_SENDER,
  // DEFAULT_TRANSACTION_RECEIV_DATA: DEFAULT_TRANSACTION_RECEIV_DATA,
};

export default CONST;
