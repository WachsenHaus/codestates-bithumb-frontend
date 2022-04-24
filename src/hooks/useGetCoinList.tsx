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

import _ from 'lodash';
import {
  selectPriceInfoToCoins,
  selectTransactionInfoToCoins,
} from '../atom/tradeData.atom';
import {
  atomDrawTransaction,
  atomFilteredCoins,
  selectorFilterUseCoins,
  atomFinalCoins,
  atomFinalTransaction,
  selectorMergeTickerAndCoins,
  selectorPriceFilterdCoins,
  atomPriceInfoUseCoins,
  atomUseCoins,
  selectorWebSocketTransaction,
} from '../atom/total.atom';
import { atomSelectCoinDetail } from '../atom/selectCoinDetail.atom';

/**
 *
 * @returns 코인 리스트들을 받아옵니다.
 */
export const useGetCoinList = () => {
  // 코인에 대한 정보를 받아 옵니다 .
  const queryResults = useRecoilValueLoadable(atomGetCoinList);
  const setCoinState = useSetRecoilState(atomCoinList);

  // 사용할 코인리스트만을 필터링합니다.
  const filterdUseCoins = useRecoilValueLoadable(selectorFilterUseCoins);
  const setUseCoins = useSetRecoilState(atomUseCoins);

  // 가격 정보를 사용할 코인리스트에 넣고
  const pricefilterCoins = useRecoilValueLoadable(selectorPriceFilterdCoins);
  const setFilteredCoins = useSetRecoilState(atomFilteredCoins);

  // 티커정보와 코인정보를 합칩니다.
  const mergeTickerAndCoins = useRecoilValueLoadable(
    selectorMergeTickerAndCoins
  );
  const setFinalCoins = useSetRecoilState(atomFinalCoins);

  // 초기 useCoin리스트에 현재가,변동률,거래금액을 덮어씌기 하는 데이터
  const selectTicker = useRecoilValueLoadable(selectPriceInfoToCoins);

  // 초기 트랜잭션 데이터를 가져와 갱신함.
  const selectTransaction = useRecoilValueLoadable(
    selectTransactionInfoToCoins
  );

  /**
   * 웹소켓으로 트랜직션이 들어오는 데이터.
   */
  const selectWebSocketTransaction = useRecoilValueLoadable(
    selectorWebSocketTransaction
  );

  const setSelectDetailCoin = useSetRecoilState(atomSelectCoinDetail);
  const setPriceInfoUseCoins = useSetRecoilState(atomPriceInfoUseCoins);
  const setDrawTransaction = useSetRecoilState(atomDrawTransaction);
  const setFinalDrawTransaction = useSetRecoilState(atomFinalTransaction);

  /**
   * 최초 코인리스트를 받아오면 동작하는 기능.
   */
  useEffect(() => {
    const { state, contents } = queryResults;
    if (state === 'hasValue') {
      if (contents?.status === API_BITHUMB_STATUS_CODE.SUCCESS) {
        setCoinState(contents?.data);
      }
    } else if (state === 'hasError') {
      console.log('erro');
    }
  }, [queryResults, setCoinState]);

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

  /**
   * 가격정보와 사용할 코인리스트에서 티커정보를 합치고, finalCoins에 집어넣습니다.
   */
  useEffect(() => {
    const { state, contents } = mergeTickerAndCoins;
    if (state === 'hasValue') {
      setFinalCoins(contents);
    } else if (state === 'hasError') {
      console.log('erro');
    }
  }, [mergeTickerAndCoins, setFinalCoins]);

  /**
   * 선택된 코인이 변경되
   */
  useEffect(() => {
    const { state, contents } = selectTicker;
    if (state === 'hasValue') {
      if (contents) {
        setSelectDetailCoin(contents?.defaultObj);
        setPriceInfoUseCoins(contents?.result);
      }
    } else if (state === 'hasError') {
      console.log('error');
    }
  }, [selectTicker]);

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

  /**
   * 웹소켓으로 트랜잭션 데이터가 들어오면, detail을 갱신하고, 트랜잭션 리스트를 수정함.
   */
  useEffect(() => {
    const { state, contents } = selectWebSocketTransaction;
    if (state === 'hasValue') {
      // contents && console.log(contents.deepCopyDrawTransaction);
      contents && setFinalDrawTransaction(contents.deepCopyDrawTransaction);
      contents &&
        setSelectDetailCoin((prevData) => {
          return {
            ...prevData,
            e: contents.coinbarPrice,
          };
        });
    } else if (state === 'hasError') {
      console.log('error');
    }
  }, [selectWebSocketTransaction]);
};
