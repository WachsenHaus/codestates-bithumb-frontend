import _, { result } from 'lodash';
import { resolve } from 'node:path/win32';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { API_BITHUMB_STATUS_CODE } from '../api/bt.api';
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
} from '../atom/total.atom';
import {
  selectPriceInfoToCoins,
  selectTransactionInfoToCoins,
  TypeTradeTransaction,
} from '../atom/tradeData.atom';

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
      setUseCoins(contents);
    } else if (state === 'hasError') {
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
        //
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
  const pricefilterCoins = useRecoilValueLoadable(selectorPriceFilterdCoins);
  const setFilteredCoins = useSetRecoilState(atomFilteredCoins);
  /**
   *
   */
  useEffect(() => {
    const { state, contents } = pricefilterCoins;
    if (state === 'hasValue') {
      setFilteredCoins(contents);
    } else if (state === 'hasError') {
      console.log('erro');
    }
  }, [pricefilterCoins, setFilteredCoins]);
};

const useMergeTickersWebsocketAndFilteredData = () => {
  // 티커정보와 코인정보를 합칩니다.
  const getAtomTicker = useRecoilValue(atomTickers);
  const [priceInfoUseCoin, setPriceInfoUseCoins] = useRecoilState(
    atomPriceInfoUseCoins
  );

  const merge = async () => {
    const result = new Promise<TypeDrawTicker[]>((resolve, reject) => {
      const tickerObj = getAtomTicker;
      const coins = priceInfoUseCoin;
      const isExist = coins.findIndex((item) => item.coinType === tickerObj.c);
      if (isExist === -1) {
        resolve(coins);
      } else if (tickerObj.m === 'C0101') {
        resolve(coins);
      } else {
        // console.log({ ...tickerObj });
        const draft = _.cloneDeep(coins);
        let isUp;
        const currentPrice = Number(tickerObj.e);
        const prevPrice = Number(draft[isExist].e);
        if (currentPrice > prevPrice) {
          isUp = true;
        } else if (currentPrice === prevPrice) {
          isUp = undefined;
        } else {
          isUp = false;
        }
        draft[isExist] = { ...draft[isExist], ...tickerObj, isUp };
        // console.log(draft[isExist]);
        resolve(draft);
      }
    });
    result.then((i) => setPriceInfoUseCoins(i));
  };

  useEffect(() => {
    merge();
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
 *
 */
const useMergeTransactionWebsocketAndInitData = () => {
  const websocketTransaction = useRecoilValue(atomTransactions);
  const [drawTransaction, setDrawTransaction] =
    useRecoilState(atomDrawTransaction);
  const setSelectDetailCoin = useSetRecoilState(atomSelectCoinDetail);

  const merge = async () => {
    const result = new Promise<TypeTradeTransaction[]>((resolve, reject) => {
      const deepCopyInitTransaction = _.cloneDeep(drawTransaction);
      if (drawTransaction === undefined) {
        return;
      }
      const { m, c, l } = websocketTransaction;
      for (let i = 0; i < l.length; i++) {
        const { o, n, p, q, t } = l[i];
        let color = '1';
        let prevPrice;
        const lastItem =
          deepCopyInitTransaction[deepCopyInitTransaction.length - 1];
        if (lastItem) {
          prevPrice = lastItem.contPrice;
          if (p === prevPrice) {
            color = lastItem.buySellGb;
          } else if (p > prevPrice) {
            color = '2';
          } else {
            color = '1';
          }
        }
        setSelectDetailCoin((prevData) => {
          return {
            ...prevData,
            e: p,
          };
        });
        deepCopyInitTransaction.push({
          coinType: c, //
          contAmt: n, //
          crncCd: m, //
          buySellGb: color,
          contPrice: p, //현재가
          contQty: q, // 수량
          contDtm: t, //
        });

        // 트랜잭션은 20개의 데이터만 보관함.
        if (deepCopyInitTransaction.length > 20) {
          deepCopyInitTransaction.shift();
        }
      }
      resolve(deepCopyInitTransaction);
    });
    result.then((item) => setDrawTransaction(item));
  };

  useEffect(() => {
    merge();
  }, [websocketTransaction]);
};

/**
 * URL주소를 분석하고 해당 값으로 defaultCoin을 설정합니다.
 */
const useGetTradeParam = () => {
  const params = useParams();
  const coins = useRecoilValue(atomCoinList);
  const setSelectCoin = useSetRecoilState(atomSelectCoinDefault);

  useEffect(() => {
    if (params?.coinName) {
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
    } else {
      setSelectCoin({
        coinType: 'C0101',
        coinSymbol: 'BTC',
        marketSymbol: 'KRW',
        siseCrncCd: 'C0100',
      });
    }
  }, [params, coins]);
};

const useInitialize = () => {
  /**
   * 티커
   */
  // 코인 정보를 받아온다.
  useGetCoinList();
  // URL을 분석하여 선택된 코인을 변경한다.
  useGetTradeParam();

  // 사용할 코인리스트만 추린다.
  useGetFiltredUseCoins();
  // 추린 코인리스트에 가격정보를 병합한다.
  useGetPriceInfoList();
  // 티커정보를 필터링된 배열과 병합하고, 코인리스트를 atomFinalCoin에 할당한다
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
