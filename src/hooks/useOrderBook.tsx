import { useRef, useEffect } from 'react';
import { useRecoilStateLoadable, useSetRecoilState } from 'recoil';
import { selectorGetOrderBook, atomOrderBook } from '../atom/orderBook.atom';

/**
 * 1초에 한번씩 호가창의 데이터를 받아옵니다.
 */
export const useGetOrderBookInterval = () => {
  const timerId = useRef<NodeJS.Timer | null>(null);
  const isFetching = useRef(false);

  const [getOrderBook, reload] = useRecoilStateLoadable(selectorGetOrderBook);
  const setOrderBookData = useSetRecoilState(atomOrderBook);
  useEffect(() => {
    if (getOrderBook.state === 'hasValue') {
      getOrderBook.contents && setOrderBookData(getOrderBook.contents);
      isFetching.current = false;
    }
  }, [getOrderBook, setOrderBookData]);

  useEffect(() => {
    timerId.current = setInterval(async () => {
      if (isFetching.current) {
        return;
      }
      isFetching.current = true;
      reload(undefined);
    }, 1000);

    return () => {
      if (timerId.current) {
        setOrderBookData({
          ask: [],
          bid: [],
        });
        clearInterval(timerId.current);
        timerId.current = null;
      }
    };
  }, [reload, setOrderBookData]);
};
