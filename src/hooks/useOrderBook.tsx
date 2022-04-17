import axios from 'axios';
import { useRef, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { API_BITHUMB } from '../api/bt.api';
import { atomOrderBook, IOrderBookData } from '../atom/orderBook.atom';
import { atomSelectCoin } from '../atom/selectCoin.atom';
import { atomChartData, ICoinChart } from '../atom/tvChart.atom';
import { ResponseVO } from '../type/api';
import { Log } from '../utils/log';

/**
 * 1초에 한번씩 호가창의 데이터를 받아옵니다.
 */
export const useGetOrderBookInterval = () => {
  const timerId = useRef<NodeJS.Timer | null>(null);
  const selectCoin = useRecoilValue(atomSelectCoin);
  const setOrderBookData = useSetRecoilState(atomOrderBook);
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const isFetching = useRef(false);
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
      isFetching.current = true;
      const result = await axios.get<ResponseVO<IOrderBookData>>(
        `${API_BITHUMB.GET_ORDERBOOK}/${url}`,
        {
          cancelToken: source.token,
        }
      );
      setOrderBookData(result.data.data);
      isFetching.current = false;
    } catch (err) {
      Log(err);
      return undefined;
    }
  };

  useEffect(() => {
    // source.cancel('호출취소');
    getData();
    timerId.current = setInterval(async () => {
      if (isFetching.current) {
        return;
      }
      getData();
    }, 1000);

    return () => {
      if (timerId.current) {
        source.cancel('호출취소');
        setOrderBookData({
          ask: [],
          bid: [],
        });
        clearInterval(timerId.current);
        timerId.current = null;
      }
    };
  }, [selectCoin]);
};
