import {
  IOrderBookDepthTypes,
  IOrderBookReceiverTypes,
  ITickerReceiverTypes,
  ITickerTypes,
  ITransactionReceiverTypes,
  ITransactionTypes,
} from '../atom/user.atom';
import { CoinSymbolBTCTypes, CoinSymbolKRWTypes } from '../type/coinTypes';
import {
  DEFAULT_ORDERBOOK_DEPTH_RECEIV_DATA,
  DEFAULT_ORDERBOOK_DEPTH_SOCKET,
  DEFAULT_TICKER_RECEIV_DATA,
  DEFAULT_TICKER_SOCKET,
  DEFAULT_TRANSACTION_RECEIV_DATA,
  DEFAULT_TRANSACTION_SOCKET,
} from './defaultData';

interface ConstTypes {
  ENABLE_KRW_SYMBOL: CoinSymbolKRWTypes[];
  ENABLE_BTC_SYMBOL: CoinSymbolBTCTypes[];
  DEFAULT_TICKER_SOCKET: ITickerTypes;
  DEFAULT_TICKER_RECEIV_DATA: ITickerReceiverTypes;
  DEFAULT_ORDERBOOK_DEPTH_SOCKET: IOrderBookDepthTypes;
  DEFAULT_ORDERBOOK_DEPTH_RECEIV_DATA: IOrderBookReceiverTypes;
  DEFAULT_TRANSACTION_SOCKET: ITransactionTypes;
  DEFAULT_TRANSACTION_RECEIV_DATA: ITransactionReceiverTypes;
}

const CONST: ConstTypes = {
  ENABLE_KRW_SYMBOL: ['BTC_KRW', 'ETH_KRW', 'KLAY_KRW', 'XNO_KRW', 'ZIL_KRW'],
  ENABLE_BTC_SYMBOL: ['ASTA_BTC', 'BLY_BTC', 'IBP_BTC', 'LN_BTC', 'XRP_BTC'],
  DEFAULT_TICKER_SOCKET: DEFAULT_TICKER_SOCKET,
  DEFAULT_TICKER_RECEIV_DATA: DEFAULT_TICKER_RECEIV_DATA,
  DEFAULT_ORDERBOOK_DEPTH_SOCKET: DEFAULT_ORDERBOOK_DEPTH_SOCKET,
  DEFAULT_ORDERBOOK_DEPTH_RECEIV_DATA: DEFAULT_ORDERBOOK_DEPTH_RECEIV_DATA,
  DEFAULT_TRANSACTION_SOCKET: DEFAULT_TRANSACTION_SOCKET,
  DEFAULT_TRANSACTION_RECEIV_DATA: DEFAULT_TRANSACTION_RECEIV_DATA,
};

export default CONST;