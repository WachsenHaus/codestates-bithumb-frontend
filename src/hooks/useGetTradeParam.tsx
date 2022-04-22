import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { atomCoinList } from '../atom/coinList.atom';
import { atomCommonConfig } from '../atom/commonConfig.atom';
import { atomSelectCoin } from '../atom/selectCoin.atom';

/**
 * 파라미터를 분석해서, 코인리스트에 있는 정보를 selectCoin아톰에 저장합니다.
 */
const useGetTradeParam = () => {
  const params = useParams();
  const coinState = useRecoilValueLoadable(atomCoinList);
  const [selectCoin, setSelectCoin] = useRecoilState(atomSelectCoin);

  useEffect(() => {
    //해당 정보로 tradeData실행해야지
    if (params && coinState.state === 'hasValue') {
      const result = params?.coinName?.split('_');
      if (coinState && result) {
        const item = coinState.contents?.coinList.find(
          (item) => item.coinSymbol === result[0]
        );
        const type = item?.coinType;
        const siseCrncCd = item?.siseCrncCd;
        const coinSymbol = item?.coinSymbol;
        const marketSymbol = result[1];
        if (type && siseCrncCd && coinSymbol && marketSymbol) {
          setSelectCoin((prevData) => {
            return {
              ...prevData,
              coinType: type,
              coinSymbol: coinSymbol,
              marketSymbol: marketSymbol,
              siseCrncCd: siseCrncCd,
            };
          });
        }
      }
    }
  }, [params, coinState]);
};

export default useGetTradeParam;
