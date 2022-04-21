import { Box, Typography } from '@mui/material';
import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { atomDrawCoinInfo, atomDrawTransaction } from '../../atom/drawData.atom';
import { atomOrderBook } from '../../atom/orderBook.atom';
import { atomSelectCoin } from '../../atom/selectCoin.atom';
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
  const transaction = useRecoilValue(atomDrawTransaction);
  const { marketSymbol } = useRecoilValue(atomSelectCoin);
  const { f, coinSymbol } = useRecoilValue(atomDrawCoinInfo);
  const [maxQuantity, setMaxQuantity] = useState('0');

  // useEffect(() => {
  //   let baseQuantity = 0;
  //   if (orderBook.ask.length === 0 && orderBook.bid.length === 0) {
  //     return;
  //   }
  //   for (let i = 0; i < orderBook.ask.length; i++) {
  //     const { q } = orderBook.ask[i];
  //     if (Number(q) >= baseQuantity) {
  //       baseQuantity = Number(q);
  //     }
  //   }
  //   for (let i = 0; i < orderBook.bid.length; i++) {
  //     const { q } = orderBook.bid[i];
  //     if (Number(q) >= baseQuantity) {
  //       baseQuantity = Number(q);
  //     }
  //   }
  //   setMaxQuantity(baseQuantity.toString());
  // }, [orderBook]);

  const getEventType = useCallback((targetPrice: string, basePrice: string, targetBuySellGb: string) => {
    if (targetPrice === basePrice) {
      return targetBuySellGb === '2' ? 'bid' : 'ask';
    }
  }, []);

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
      <Typography align="center">호가창</Typography>
      <Box className="flex justify-around items-center font-bmjua">
        <Typography className="font-bmjua">가격({marketSymbol})</Typography>
        <Typography>수량({coinSymbol})</Typography>
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
            const eventType = getEventType(lastTransaction.contPrice, item.p, lastTransaction.buySellGb);
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
          const eventType = getEventType(lastTransaction.contPrice, item.p, lastTransaction.buySellGb);
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
      </Box>
    </Box>
  );
};

export default Orderbook;
