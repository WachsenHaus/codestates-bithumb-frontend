import produce from 'immer';
import React, { useEffect, useState } from 'react';
import hangul from 'hangul-js';
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { API_BITHUMB_STATUS_CODE } from '../api/bt.api';
import { atomCoinList, atomGetCoinList } from '../atom/coinList.atom';
import {
  atomDrawCoinInfo,
  atomDrawTicker,
  atomDrawTransaction,
  TypeDrawTicker,
} from '../atom/drawData.atom';
import _, { iteratee } from 'lodash';
import { atomTradeData, TypeTradeTransaction } from '../atom/tradeData.atom';
import { atomSelectCoin } from '../atom/selectCoin.atom';
import { getCookie, unpackCookie } from '../utils/utils';
import { atomCommonConfig } from '../atom/commonConfig.atom';
import {
  atomFilteredCoins,
  atomFilterUseCoins,
  atomFinalCoins,
  atomMergeTickerAndCoins,
  atomPriceFilterdCoins,
  atomPriceInfoUseCoins,
  atomUseCoins,
} from '../atom/total.atom';

export const GetConsonant = ({
  coinName,
  coinNameEn,
  coinSymbol,
}: {
  coinName: string;
  coinNameEn: string;
  coinSymbol: string;
}) => {
  const result = hangul.d(coinName, true);
  if (result) {
    let data = '';
    for (let i = 0; i < result.length; i++) {
      data = data + result[i][0];
    }
    data.replace(' ', '');
    data += coinNameEn;
    data += coinSymbol;
    data += coinName;
    return data;
  }
};

/**
 *
 * @returns 코인 리스트들을 받아옵니다.
 */
export const useGetCoinList = () => {
  const queryResults = useRecoilValueLoadable(atomGetCoinList);
  const filterdUseCoins = useRecoilValueLoadable(atomFilterUseCoins);
  const pricefilterCoins = useRecoilValueLoadable(atomPriceFilterdCoins);
  const mergeTickerAndCoins = useRecoilValueLoadable(atomMergeTickerAndCoins);

  // const setDrawTicker = useSetRecoilState(atomDrawTicker);
  const setCoinState = useSetRecoilState(atomCoinList);
  const setUseCoins = useSetRecoilState(atomUseCoins);
  const setFilteredCoins = useSetRecoilState(atomFilteredCoins);
  const setFinalCoins = useSetRecoilState(atomFinalCoins);

  /**
   * 최초 코인리스트를 받아오면 동작하는 기능.
   */
  useEffect(() => {
    const { state, contents } = queryResults;
    if (state === 'hasValue') {
      if (contents?.status === API_BITHUMB_STATUS_CODE.SUCCESS) {
        setCoinState(contents?.data);
      }
    }
  }, [queryResults.state]);

  useEffect(() => {
    if (filterdUseCoins.state === 'hasValue') {
      // 임시로 설정함 기존 코드 유지용
      // setDrawTicker(filterdUseCoins.contents);
      setUseCoins(filterdUseCoins.contents);
    }
  }, [filterdUseCoins.contents, filterdUseCoins.state, setUseCoins]);

  useEffect(() => {
    if (pricefilterCoins.state === 'hasValue') {
      console.log('왜느리지');
      console.log(new Date());
      console.log(pricefilterCoins.contents);
      setFilteredCoins(pricefilterCoins.contents);
    }
  }, [pricefilterCoins.contents, pricefilterCoins.state, setFilteredCoins]);

  useEffect(() => {
    if (mergeTickerAndCoins.state === 'hasValue') {
      mergeTickerAndCoins && setFinalCoins(mergeTickerAndCoins.contents);
    }
  }, [mergeTickerAndCoins, setFinalCoins]);
};

/**
 * 선택된 코인이 변화되면 해당 거래정보를 한번에 다 받아옵니다.
 */
export const useGetTradeData = () => {
  const tradeData = useRecoilValueLoadable(atomTradeData);
  const selectCoin = useRecoilValue(atomSelectCoin);
  const [drawTicker, setDrawTicker] = useRecoilState(atomDrawTicker);

  const [useCoins, setUseCoins] = useRecoilState(atomUseCoins);
  const setPriceInfoUseCoins = useSetRecoilState(atomPriceInfoUseCoins);
  const setDrawCoinInfo = useSetRecoilState(atomDrawCoinInfo);
  const setCommonConfig = useSetRecoilState(atomCommonConfig);
  const setDrawTransaction = useSetRecoilState(atomDrawTransaction);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if (useCoins.length > 1) {
      setFlag(true);
    }
  }, [useCoins]);

  useEffect(() => {
    if (
      flag === true &&
      tradeData.state === 'hasValue' &&
      tradeData?.contents?.message === API_BITHUMB_STATUS_CODE.SUCCESS_STR
    ) {
      const tickerData =
        tradeData.contents.data[selectCoin.siseCrncCd]['ticker'];
      const tickerKeys = Object.keys(tickerData);
      let defaultObj: TypeDrawTicker = {};

      const tickerPromise = new Promise<TypeDrawTicker[]>((resolve, reject) => {
        const next = produce(useCoins, (draft) => {
          for (let i = 0; i < tickerKeys.length; i++) {
            const {
              coinType,
              buyVolume,
              chgAmt,
              chgRate,
              openPrice,
              volume24H,
              value24H,
              prevClosePrice,
              highPrice,
              lowPrice,
              closePrice,
            } = tickerData[tickerKeys[i]];
            const isExist = draft.findIndex(
              (item) => item.coinType === coinType
            );

            const selectIdx = draft.findIndex(
              (item) => item.coinSymbol === selectCoin.coinSymbol
            );
            if (coinType === selectCoin.coinType) {
              defaultObj = {
                coinType: draft[selectIdx].coinType,
                coinSymbol: draft[selectIdx].coinSymbol,
                e: closePrice,
                u24: value24H,
                v24: volume24H,
                h: highPrice,
                r: chgRate,
                l: lowPrice,
                f: prevClosePrice,
                siseCrncCd: draft[selectIdx].siseCrncCd,
              };
            }

            if (isExist === -1) {
            } else {
              draft[isExist] = {
                ...draft[isExist],
                u24: value24H,
                r: chgRate,
                e: closePrice,
                a: chgAmt,
              };
            }
          }
        });
        if (next) {
          resolve(next);
        } else {
          reject('err');
        }
      });

      const transactionData =
        tradeData.contents.data[selectCoin.siseCrncCd]['transaction'];
      const transactionKeys = Object.keys(transactionData);
      const data = transactionData[transactionKeys[0]];

      const transactionPromise = new Promise<TypeTradeTransaction[]>(
        (resolve, reject) => {
          const next = produce(data, (draft) => {
            let color;
            for (let i = 0; i < draft.length; i++) {
              if (i !== 0) {
                const prevPrice = draft[i - 1].contPrice;
                const curPrice = draft[i].contPrice;
                if (curPrice === prevPrice) {
                  color = draft[i - 1].buySellGb;
                } else if (curPrice > prevPrice) {
                  color = '2';
                } else {
                  color = '1';
                }
                draft[i].buySellGb = color;
              }
            }
          });
          if (next) {
            resolve(next);
          } else {
            reject(undefined);
          }
        }
      );

      Promise.all([tickerPromise, transactionPromise]).then((values) => {
        const [ticker, transaction] = values;
        // setDrawTicker(ticker);
        console.log('여기');
        console.log(ticker);
        setPriceInfoUseCoins(ticker);
        // setFinalUseCoins(ticker);
        setDrawCoinInfo(defaultObj);
        setDrawTransaction(transaction);
        setCommonConfig({
          isInit: true,
        });
      });
    }
  }, [flag, tradeData, selectCoin]);
};
