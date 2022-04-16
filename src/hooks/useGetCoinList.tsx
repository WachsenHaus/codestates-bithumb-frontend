import produce from 'immer';
import React, { useEffect, useState } from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { API_BITHUMB_STATUS_CODE } from '../api/bt.api';
import { atomCoinList, atomGetCoinList } from '../atom/coinList.atom';
import { TypeCoinObj } from '../atom/coinList.type';
import {
  atomDrawTicker,
  atomDrawTransaction,
  TypeDrawTicker,
} from '../atom/drawData.atom';
import _ from 'lodash';
import { atomTradeData, TypeTradeTransaction } from '../atom/tradeData.atom';
import { atomSelectCoin } from '../atom/selectCoin.atom';

export const useGetCoinList = () => {
  const [coinState, setCoinState] = useRecoilState(atomCoinList);
  const setDrawTicker = useSetRecoilState(atomDrawTicker);
  const queryResults = useRecoilValueLoadable(atomGetCoinList);
  useEffect(() => {
    const { state, contents } = queryResults;
    if (state === 'hasValue') {
      if (contents?.status === API_BITHUMB_STATUS_CODE.SUCCESS) {
        setCoinState(contents?.data);
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
        (item) => item.coinClassCode !== 'F' && item.isLive === true
      );
      const drawDummy = filteredData.map((item) => {
        return {
          coinClassCode: item.coinClassCode,
          coinName: item.coinName,
          coinNameEn: item.coinNameEn,
          coinSymbol: item.coinSymbol,
          coinType: item.coinType,
          isLive: item.isLive,
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

export const useGetTradeData = () => {
  const tradeData = useRecoilValueLoadable(atomTradeData);
  const { siseCrncCd } = useRecoilValue(atomSelectCoin);
  const [drawTicker, setDrawTicker] = useRecoilState(atomDrawTicker);
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
      const tickerData = tradeData.contents.data[siseCrncCd]['ticker'];
      const tickerKeys = Object.keys(tickerData);
      const result = new Promise<TypeDrawTicker[]>((resolve, reject) => {
        const next = produce(drawTicker, (draft) => {
          for (let i = 0; i < tickerKeys.length - 1; i++) {
            const {
              coinType,
              buyVolume,
              chgAmt,
              chgRate,
              openPrice,
              volume24H,
            } = tickerData[tickerKeys[i]];
            const isExist = draft.findIndex(
              (item) => item.coinType === coinType
            );

            if (isExist === -1) {
              console.log('not coin');
            } else {
              draft[isExist] = {
                ...draft[isExist],
                u24: volume24H,
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
        })
        .catch((e) => {
          console.error(e);
        });

      const transactionData =
        tradeData.contents.data[siseCrncCd]['transaction'];
      const transactionKeys = Object.keys(transactionData);
      const data = transactionData[transactionKeys[0]];
      const next = produce(data, (draft) => {
        let color;
        for (let i = 0; i < draft.length; i++) {
          if (i !== 0) {
            const prevPrice = draft[i - 1].contPrice;
            const curPrice = draft[i].contPrice;
            console.log(curPrice, prevPrice);
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
      console.log();
      setDrawTransaction(next);
    }
  }, [flag, tradeData]);

  // useEffect(() => {
  //   setDrawTicker(tempDrawTicker);
  // }, [drawTicker]);
};
