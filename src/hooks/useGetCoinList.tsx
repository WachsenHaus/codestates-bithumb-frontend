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
import { atomTradeData } from '../atom/tradeData.atom';
import { atomSelectCoin } from '../atom/selectCoin.atom';
import { getCookie } from '../utils/utils';

const GetConsonant = ({
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
  const [coinState, setCoinState] = useRecoilState(atomCoinList);
  const setDrawTicker = useSetRecoilState(atomDrawTicker);
  const queryResults = useRecoilValueLoadable(atomGetCoinList);

  /**
   * 최초 코인리스트를 받아오면 동작하는 기능.
   */
  useEffect(() => {
    const { state, contents } = queryResults;
    if (state === 'hasValue') {
      if (contents?.status === API_BITHUMB_STATUS_CODE.SUCCESS) {
        // setCookie('marketFavoritesCoin', ['BTC_KRW', 'ETH_KRW'], 1);
        setCoinState(contents?.data);
        console.log(contents?.data);
      }
    }
  }, [queryResults.state]);

  useEffect(() => {
    // 받아온 코인리스트에서 그리기위한 정보만 집어넣음.
    const result = new Promise((resolve, reject) => {
      if (coinState?.coinList === undefined) return;
      const rawData = _.cloneDeep(coinState?.coinList);
      /**
       * 코인타입이고 사용중인 코인만 필터링합니다.
       */
      const filteredData = rawData.filter(
        (item) =>
          item.coinClassCode !== 'F' &&
          item.siseCrncCd !== 'C0101' &&
          item.isLive === true
      );
      const cookieFavorites = getCookie('marketFavoritesCoin');
      const parseCookies = cookieFavorites
        .replace('[', '')
        .replace(']', '')
        .replace(/\"/g, '')
        .split(',');

      const drawDummy = filteredData.map((item) => {
        const consonant = GetConsonant({
          coinName: item.coinName,
          coinNameEn: item.coinNameEn,
          coinSymbol: item.coinSymbol,
        });
        const cookieCoinSymbol = parseCookies.find(
          (i) => i.split('_')[0] === item.coinType
        );
        return {
          isFavorite: cookieCoinSymbol ? true : false,
          siseCrncCd: item.siseCrncCd === 'C0100' ? 'KRW' : 'BTC',
          coinClassCode: item.coinClassCode,
          coinName: item.coinName,
          coinNameEn: item.coinNameEn,
          coinSymbol: item.coinSymbol,
          coinType: item.coinType,
          isLive: item.isLive,
          m: item.siseCrncCd,
          consonant,
        };
      });
      if (drawDummy) {
        resolve(drawDummy);
      } else {
        reject('err');
      }
    });
    result
      .then((data) => {
        setDrawTicker(data as TypeDrawTicker[]);
      })
      .catch((err) => console.error(err));
  }, [coinState]);

  return undefined;
};

/**
 * 선택된 코인이 변화되면 해당 거래정보를 한번에 다 받아옵니다.
 */
export const useGetTradeData = () => {
  const tradeData = useRecoilValueLoadable(atomTradeData);
  const selectCoin = useRecoilValue(atomSelectCoin);
  const [drawTicker, setDrawTicker] = useRecoilState(atomDrawTicker);
  const [drawCoinInfo, setDrawCoinInfo] = useRecoilState(atomDrawCoinInfo);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if (drawTicker.length > 1) {
      setFlag(true);
    }
  }, [drawTicker]);
  const [drawTransaction, setDrawTransaction] =
    useRecoilState(atomDrawTransaction);

  const [tempDrawTicker, setTempDrawTicker] = useState<any>([]);

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
      const result = new Promise<TypeDrawTicker[]>((resolve, reject) => {
        const next = produce(drawTicker, (draft) => {
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
                e: openPrice,
                u24: value24H,
                v24: volume24H,
                h: highPrice,
                r: chgRate,
                l: lowPrice,
                f: closePrice,
                siseCrncCd: draft[selectIdx].siseCrncCd,
              };
            }

            if (isExist === -1) {
              console.log('not coin');
            } else {
              draft[isExist] = {
                ...draft[isExist],
                u24: value24H,
                r: chgRate,
                e: openPrice,
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
      result
        .then((d) => {
          setDrawTicker(d);
          setDrawCoinInfo(defaultObj);
        })
        .catch((e) => {
          console.error(e);
        });

      const transactionData =
        tradeData.contents.data[selectCoin.siseCrncCd]['transaction'];
      const transactionKeys = Object.keys(transactionData);
      const data = transactionData[transactionKeys[0]];
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
      setDrawTransaction(next);
    }
  }, [flag, tradeData, selectCoin]);
};
