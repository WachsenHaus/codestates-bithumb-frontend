import produce from 'immer';
import _, { result } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { API_BITHUMB_STATUS_CODE } from '../api/bt.api';
import { selectorCoinBar } from '../atom/coinBar.atom';
import { selectorGetCoinList, atomCoinList } from '../atom/coinList.atom';
import { TypeDrawTicker } from '../atom/drawData.atom';
import { atomSelectCoinDefault } from '../atom/selectCoinDefault.atom';
import { atomSelectCoinDetail } from '../atom/selectCoinDetail.atom';
import {
  selectorFilterUseCoins,
  atomUseCoins,
  atomPriceInfoUseCoins,
  atomFilteredCoins,
  selectorPriceFilterdCoins,
  atomFinalCoins,
  selectorMergeTickerAndCoins,
  atomDrawTransaction,
  atomFinalTransaction,
  selectorWebSocketTransaction,
  atomTickers,
  atomTransactions,
  atomFilterMode,
  atomFilterKeyword,
  atomFilterOrderBy,
  atomFilterDirection,
} from '../atom/total.atom';
import {
  atomTradeData,
  selectorTradeData,
  selectPriceInfoToCoins,
  selectTransactionInfoToCoins,
  TypeTradeTransaction,
} from '../atom/tradeData.atom';
import { TypeWebSocketTickerReturnType } from '../atom/ws.type';
import mergeTransaction from './worker/mergeTransaction.js';
import mergeTickersWebsocketAndFilteredData from './worker/mergeTickersWebsocketAndFilteredData.js';
import { order } from '../utils/utils';

/**
 * 모든 코인에 대한 기초 정보를 받아 옵니다.
 */
const useGetCoinList = () => {
  // 코인에 대한 정보를 받아 옵니다 .
  const getCoinList = useRecoilValueLoadable(selectorGetCoinList);
  const setCoinState = useSetRecoilState(atomCoinList);
  /**
   * 최초 코인리스트를 받아오면 동작하는 기능.
   */
  useEffect(() => {
    const { state, contents } = getCoinList;
    if (state === 'hasValue') {
      if (contents?.status === API_BITHUMB_STATUS_CODE.SUCCESS) {
        setCoinState(contents?.data);
      }
    } else if (state === 'hasError') {
      console.log('erro');
    }
  }, [getCoinList, setCoinState]);
};

/**
 * URL주소를 분석하고 해당 값으로 defaultCoin을 설정합니다.
 */
const useGetTradeParam = () => {
  const coins = useRecoilValue(atomCoinList);
  const params = useParams();
  const setSelectCoin = useSetRecoilState(atomSelectCoinDefault);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (ready && coins && params?.coinName) {
      const result = params?.coinName?.split('_');
      if (coins && result) {
        const item = coins.coinList.find(
          (item) => item.coinSymbol === result[0]
        );
        const type = item?.coinType;
        const siseCrncCd = item?.siseCrncCd;
        const coinSymbol = item?.coinSymbol;
        const marketSymbol = result[1];

        if (type && siseCrncCd && coinSymbol && marketSymbol) {
          setSelectCoin((prevData) => {
            return {
              coinType: type,
              coinSymbol: coinSymbol,
              marketSymbol: marketSymbol,
              siseCrncCd: siseCrncCd,
            };
          });
        }
      }
    } else if (ready === true && params?.coinName === undefined) {
      setSelectCoin({
        coinType: 'C0101',
        coinSymbol: 'BTC',
        marketSymbol: 'KRW',
        siseCrncCd: 'C0100',
      });
    }
  }, [params, ready]);

  useEffect(() => {
    if (coins) {
      setReady(true);
    }
  }, [coins]);
};

/**
 * 선택된 코인의 초기 데이터와 코인리스트의 초기값들을 받아옵니다.
 */
const useGetTradeData = () => {
  const tradeData = useRecoilValueLoadable(selectorTradeData);
  const setTradeData = useSetRecoilState(atomTradeData);

  useEffect(() => {
    if (tradeData.state === 'hasValue') {
      tradeData.contents?.data && setTradeData(tradeData.contents.data);
    }
  }, [tradeData]);
};

/**
 * 전체적인 코인리스트에서 필터링 조건을 통과한 코인들을 반환하고 useCoins로 설정합니다.
 */
const useGetFiltredUseCoins = () => {
  const filterdUseCoins = useRecoilValueLoadable(selectorFilterUseCoins);
  const setUseCoins = useSetRecoilState(atomUseCoins);
  /**
   * 원본 코인리스트에서 필터링하고 사용할 코인리스트를 정합니다.
   */
  useEffect(() => {
    const { state, contents } = filterdUseCoins;
    if (state === 'hasValue') {
      contents && setUseCoins(contents);
    } else {
      console.log(filterdUseCoins);
      console.log('erro');
    }
  }, [filterdUseCoins, setUseCoins]);
};

/**
 * 가격정보가 포함된 코인리스트를 반환합니다.
 */
const useGetPriceInfoList = () => {
  const getPriceInfoList = useRecoilValueLoadable(selectPriceInfoToCoins);
  const setPriceInfoUseCoins = useSetRecoilState(atomPriceInfoUseCoins);
  const setSelectDetailCoin = useSetRecoilState(atomSelectCoinDetail);

  useEffect(() => {
    const { state, contents } = getPriceInfoList;
    if (state === 'hasValue') {
      if (contents) {
        setSelectDetailCoin(contents?.detailObj);
        setPriceInfoUseCoins(contents?.result);
      }
    } else if (state === 'hasError') {
      console.log('error');
    }
  }, [getPriceInfoList, setPriceInfoUseCoins, setSelectDetailCoin]);
};

/**
 * 필터링된 코인정보를 기반으로 filteredcoin에 값을 할당합니다.
 */
const useGetFilteredCoins = () => {
  // 가격 정보를 사용할 코인리스트에 넣고
  // const pricefilterCoins = useRecoilValueLoadable(selectorPriceFilterdCoins);
  const setFilteredCoins = useSetRecoilState(atomFilteredCoins);

  const filterMode = useRecoilValue(atomFilterMode);
  const filterKeyword = useRecoilValue(atomFilterKeyword);
  const filterOrder = useRecoilValue(atomFilterOrderBy);
  const filterDirection = useRecoilValue(atomFilterDirection);
  const priceInfoUseCoins = useRecoilValue(atomPriceInfoUseCoins);

  const [worker, setWorker] = useState<any>();

  useEffect(() => {
    const worker: Worker = new Worker(mergeTickersWebsocketAndFilteredData);
    setWorker(worker);
    worker.onmessage = (e) => {
      setFilteredCoins(e.data);
    };
  }, []);

  const merge = useCallback(
    async (
      filterMode,
      filterKeyword,
      filterOrder,
      filterDirection,
      priceInfoUseCoins
    ) => {
      worker &&
        worker.postMessage({
          filterMode,
          filterKeyword,
          filterOrder,
          filterDirection,
          priceInfoUseCoins,
        });
    },
    [worker]
  );

  useEffect(() => {
    merge(
      filterMode,
      filterKeyword,
      filterOrder,
      filterDirection,
      priceInfoUseCoins
    );
  }, [
    filterMode,
    filterKeyword,
    filterOrder,
    filterDirection,
    priceInfoUseCoins,
    merge,
  ]);
};

/**
 * 티커와 코인정보들을 합칩니다.
 */
const useMergeTickersWebsocketAndFilteredData = () => {
  // 티커정보와 코인정보를 합칩니다.
  const getAtomTicker = useRecoilValue(atomTickers);
  const [priceInfoUseCoin, setPriceInfoUseCoins] = useRecoilState(
    atomPriceInfoUseCoins
  );

  const merge = useCallback(
    (ticker: TypeWebSocketTickerReturnType, coinList: TypeDrawTicker[]) => {
      let draft;
      const isExist = coinList.findIndex((item) => item.coinType === ticker.c);
      if (isExist === -1) {
        return;
      } else if (ticker.m === 'C0101') {
        return;
      } else {
        draft = _.clone(coinList);
        let isUp;
        const currentPrice = Number(ticker.e);
        const prevPrice = Number(draft[isExist].e);
        if (currentPrice > prevPrice) {
          isUp = true;
        } else if (currentPrice === prevPrice) {
          isUp = undefined;
        } else {
          isUp = false;
        }
        draft[isExist] = { ...draft[isExist], ...ticker, isUp };
        setPriceInfoUseCoins(draft);
      }
    },
    []
  );

  useEffect(() => {
    const tickerObj = getAtomTicker;
    const coins = priceInfoUseCoin;
    merge(tickerObj, coins);

    // merge();
  }, [getAtomTicker]);
};

/**
 * 코인이 선택되면 초기 트랜잭션 값들을 가져온다.
 */
const useGetInitTransactionData = () => {
  // 초기 트랜잭션 데이터를 가져와 갱신함.
  const selectTransaction = useRecoilValueLoadable(
    selectTransactionInfoToCoins
  );
  const setDrawTransaction = useSetRecoilState(atomDrawTransaction);
  /**
   * 초기 트랜직션 데이터를 넣는 기능.
   */
  useEffect(() => {
    const { state, contents } = selectTransaction;
    if (state === 'hasValue') {
      contents && setDrawTransaction(contents);
    } else if (state === 'hasError') {
      console.log('error');
    }
  }, [selectTransaction]);
};

/**
 *트랜잭션데이터와 웹소켓 트랜잭션데이터를 병합합니다.
 */
const useMergeTransactionWebsocketAndInitData = () => {
  const websocketTransaction = useRecoilValue(atomTransactions);
  const [drawTransaction, setDrawTransaction] =
    useRecoilState(atomDrawTransaction);
  const [selectDetailCoin, setSelectDetailCoin] =
    useRecoilState(atomSelectCoinDetail);
  const [worker, setWorker] = useState<any>();

  useEffect(() => {
    const worker: Worker = new Worker(mergeTransaction);
    setWorker(worker);
    worker.onmessage = (e) => {
      console.log(e.data);
      setSelectDetailCoin((prevData) => {
        return {
          ...prevData,
          e: e.data.p,
        };
      });
      setDrawTransaction(e.data.cloneDrawTransaction);
    };
  }, []);
  const merge = () => {
    worker &&
      worker.postMessage({
        drawTransaction,
        websocketTransaction,
      });
  };
  useEffect(() => {
    merge();
  }, [websocketTransaction]);
};

const useInitialize = () => {
  /**
   * 티커
   */
  // 코인 정보를 받아온다.
  useGetCoinList();
  // URL을 분석하여 선택된 코인을 변경한다.
  useGetTradeParam();
  // 초기 거래 데이터들을 받아옵니다.
  useGetTradeData();
  // 사용할 코인리스트만 추린다.
  useGetFiltredUseCoins();
  // 추린 코인리스트에 가격정보를 병합한다.
  useGetPriceInfoList();
  // 티커정보를 필터링된 배열과 병합한다.
  useMergeTickersWebsocketAndFilteredData();
  // 키워드,방향등의 필터조건을 통과한 결과값을 filteredCoins에 할당한다.
  useGetFilteredCoins();

  /**
   * 트랜잭션
   */
  // 코인이 변경되면 초기 트랜잭션 데이터를 받아온다.
  useGetInitTransactionData();
  // 받아온 트랜잭션 데이터와 웹소켓 데이터를 병합한다.
  useMergeTransactionWebsocketAndInitData();
};

export default useInitialize;
