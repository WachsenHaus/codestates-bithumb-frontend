import axios from 'axios';
import { useRef, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { API_BITHUMB } from '../api/bt.api';
import { atomOrderBook, IOrderBookData } from '../atom/orderBook.atom';
import { atomSelectCoin } from '../atom/selectCoin.atom';
import { atomChartData, ICoinChart } from '../atom/tvChart.atom';
import { ResponseVO } from '../type/api';
import { Log } from '../utils/log';

export const useGetOrderBook = () => {
  const timerId = useRef<NodeJS.Timer | null>(null);
  const selectCoin = useRecoilValue(atomSelectCoin);
  const setOrderBookData = useSetRecoilState(atomOrderBook);
  // const setChartData = useSetRecoilState(atomChartData);

  //   const getD = async () => {
  //     const result = await axios.get(
  //       `https://pub1.bithumb.com/trade-info/v1/getTradeData?type=custom&crncCd=C0100&coin=C0101&lists=%7Bticker%3A%20%7B%20coinType%3A%20%27ALL%27%2C%20tickType%3A%20%27MID%27%20%7D%2Ctransaction%3A%20%7B%20limit%3A%2031%20%7D%7D`
  //     );
  //     console.log(result);
  //   };
  const getData = async () => {
    const { coinSymbol, marketSymbol } = selectCoin;
    const url = `${coinSymbol}_${marketSymbol}/1`;
    try {
      const result = await axios.get<ResponseVO<IOrderBookData>>(
        `${API_BITHUMB.GET_ORDERBOOK}/${url}`
      );
      setOrderBookData(result.data.data);
    } catch (err) {
      Log(err);
      return undefined;
    }
  };
  useEffect(() => {
    getData();
    timerId.current = setInterval(async () => {
      getData();
    }, 1000);

    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
        timerId.current = null;
      }
    };
  }, [selectCoin]);
};
