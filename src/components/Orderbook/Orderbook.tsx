import { Box, Typography } from '@mui/material';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import {
  atomDrawCoinInfo,
  atomDrawTransaction,
} from '../../atom/drawData.atom';
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
  const { coinSymbol, siseCrncCd, marketSymbol } =
    useRecoilValue(atomSelectCoin);

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
          .slice(0)
          .reverse()
          .map((item, index) => {
            let isEventType: 'ask' | 'bid' | undefined = undefined;
            if (transaction[transaction.length - 1]?.contPrice === item.p) {
              isEventType =
                transaction[transaction.length - 1]?.buySellGb === '2'
                  ? 'bid'
                  : 'ask';
            }
            return (
              <OrderbookRow
                key={index}
                price={item.p}
                quantity={item.q}
                orderType={'ask'}
                eventType={isEventType}
              />
            );
          })}
        {orderBook?.bid.map((item, index) => {
          let isEventType: 'ask' | 'bid' | undefined = undefined;
          if (transaction[transaction.length - 1]?.contPrice === item.p) {
            isEventType =
              transaction[transaction.length - 1]?.buySellGb === '2'
                ? 'bid'
                : 'ask';
          }
          return (
            <OrderbookRow
              key={index}
              price={item.p}
              quantity={item.q}
              orderType={'bid'}
              eventType={isEventType}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default Orderbook;
