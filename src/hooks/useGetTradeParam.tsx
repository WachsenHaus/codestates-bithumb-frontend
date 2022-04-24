import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { atomCoinList } from '../atom/coinList.atom';
import { atomSelectCoinDefault } from '../atom/selectCoinDefault.atom';
import { atomFilteredCoins, atomPriceInfoUseCoins } from '../atom/total.atom';

/**
 * 파라미터를 분석해서, 코인리스트에 있는 정보를 selectCoin아톰에 저장합니다.
 */
const useGetTradeParam = () => {
  const params = useParams();
  const coins = useRecoilValue(atomCoinList);
  const setSelectCoin = useSetRecoilState(atomSelectCoinDefault);
  // console.log(params);
  useEffect(() => {
    if (params?.coinName) {
      const result = params?.coinName?.split('_');
      console.log(result);
      console.log(coins);
      console.log(params);
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
      console.log('?11');
      setSelectCoin({
        coinType: 'C0101',
        coinSymbol: 'BTC',
        marketSymbol: 'KRW',
        siseCrncCd: 'C0100',
      });
    }
  }, [params]);
};

export default useGetTradeParam;
