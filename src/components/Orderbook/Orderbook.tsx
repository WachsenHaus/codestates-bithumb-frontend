import { Box, Skeleton, Typography } from '@mui/material';
import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { atomDrawCoinInfo } from '../../atom/drawData.atom';
import { atomOrderBook, TypeOrderObj } from '../../atom/orderBook.atom';

import { atomSelectCoinDefault } from '../../atom/selectCoinDefault.atom';
import { atomSelectCoinDetail } from '../../atom/selectCoinDetail.atom';
import { atomFinalTransaction } from '../../atom/total.atom';
import { useGetOrderBookInterval } from '../../hooks/useOrderBook';
import OrderbookRow from './OrderbookRow';

const CONST_DISPALY_COUNT = 30;
const CONST_LOADING_CNT = 16;

/**
 *
 * @returns 호가창 컴포넌트
 */
const Orderbook = () => {
  useGetOrderBookInterval();
  const orderBook = useRecoilValue(atomOrderBook);
  const transaction = useRecoilValue(atomFinalTransaction);
  const { marketSymbol, coinSymbol } = useRecoilValue(atomSelectCoinDefault);
  const { f } = useRecoilValue(atomSelectCoinDetail);
  const [maxQuantity, setMaxQuantity] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  const getMaxValueOrderBook = async (
    baseValue: string,
    values: TypeOrderObj[]
  ) => {
    let base = Number(baseValue);
    for (let i = 0; i < values.length; i++) {
      const { q } = values[i];
      if (Number(q) >= base) {
        base = Number(q);
      }
    }
    return base.toString();
  };

  const calcQuantity = async (ask: TypeOrderObj[], bid: TypeOrderObj[]) => {
    let baseQuantity = '0';
    const firstMaxValue = await getMaxValueOrderBook(baseQuantity, ask);
    const lastMaxValue = await getMaxValueOrderBook(firstMaxValue, bid);
    setMaxQuantity(lastMaxValue.toString());
  };

  useEffect(() => {
    calcQuantity(orderBook.ask, orderBook.bid);
    if (orderBook.ask.length > 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [orderBook]);

  const getEventType = useCallback(
    (targetPrice: string, basePrice: string, targetBuySellGb: string) => {
      if (targetPrice === basePrice) {
        return targetBuySellGb === '2' ? 'bid' : 'ask';
      }
    },
    []
  );

  const getRateOfChange = useCallback((f: string | undefined, e: string) => {
    if (f === undefined) {
      return;
    }
    const basePrice = Number(f);
    const currentPrice = Number(e);
    const r = (currentPrice * 100) / basePrice - 100;

    if (r === 0) {
      return r.toFixed(2).toString();
    } else if (r.toFixed(2).toString().includes('-')) {
      return r.toFixed(2).toString();
    } else {
      return `+${r.toFixed(2).toString()}`;
    }
  }, []);

  const getQuantityRatio = useCallback((q: string, maxQ: string) => {
    return ((Number(q) / Number(maxQ)) * 100).toString();
  }, []);

  return (
    <Box className={classNames(`w-full`)}>
      <Box className={classNames(` py-4`, `shadow-sm`, `font-bmjua`)}>
        <p className="text-center">호가창</p>
        <Box className="mt-2 flex justify-around items-center text-sm">
          <p className="">가격({marketSymbol})</p>
          <p className="">수량({coinSymbol})</p>
        </Box>
      </Box>

      <Box
        sx={{
          height: { sm: 200, md: 440 },
        }}
        className={classNames(`scrollbar-hide overflow-y-auto`)}
      >
        {orderBook?.ask
          ?.slice(0)
          .reverse()
          .map((item, index) => {
            // 변동량은 전일종가를 비율식으로 계산한것.
            const lastTransaction = transaction[transaction.length - 1];
            if (lastTransaction === undefined) {
              return;
            }
            const eventType = getEventType(
              lastTransaction.contPrice,
              item.p,
              lastTransaction.buySellGb
            );
            const r = getRateOfChange(f, item.p);

            return (
              <OrderbookRow
                key={index}
                r={r}
                price={item.p}
                quantity={item.q}
                quantityRatio={getQuantityRatio(item.q, maxQuantity)}
                orderType={'ask'}
                eventType={eventType}
              />
            );
          })}
        {orderBook?.bid?.map((item, index) => {
          const lastTransaction = transaction[transaction.length - 1];
          if (lastTransaction === undefined) {
            return;
          }
          const eventType = getEventType(
            lastTransaction.contPrice,
            item.p,
            lastTransaction.buySellGb
          );
          const r = getRateOfChange(f, item.p);
          return (
            <OrderbookRow
              key={index}
              index={index}
              r={r}
              price={item.p}
              quantity={item.q}
              quantityRatio={getQuantityRatio(item.q, maxQuantity)}
              orderType={'bid'}
              eventType={eventType}
            />
          );
        })}
        {isLoading === false && <Skeleton height={'100%'} animation="wave" />}
      </Box>
    </Box>
  );
};

export default Orderbook;
