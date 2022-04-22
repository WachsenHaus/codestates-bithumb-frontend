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

  const getData = async () => {
    const { coinSymbol, marketSymbol } = selectCoin;
    const time = 1; // 분 단위로 설정할 수 있어야함
    const url = `${coinSymbol}_${marketSymbol}/${time}`;
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
