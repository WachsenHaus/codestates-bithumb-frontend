import { Box, Typography } from '@mui/material';
import axios from 'axios';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Meter, Spinner } from 'grommet';
import produce from 'immer';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { atomOrderBook } from '../../atom/orderBook.atom';
import { atomSelectCoin } from '../../atom/selectCoin.atom';
import {
  orderbookdepthReceiveState,
  transactionReceiveState,
  OrderBookReceiverListType,
  TransactionReceiverListType,
  IOrderBookReceiverTypes,
} from '../../atom/user.atom';
import { useGetOrderBook } from '../../hooks/useOrderBook';
import styles from './../animation.module.css';
import OrderbookRow from './OrderbookRow';

const CONST_DISPALY_COUNT = 30;
const CONST_LOADING_CNT = 16;

/**
 *
 * @returns 호가창 컴포넌트
 */
const Orderbook = () => {
  useGetOrderBook();
  const orderBook = useRecoilValue(atomOrderBook);
  const { coinSymbol, siseCrncCd, marketSymbol } =
    useRecoilValue(atomSelectCoin);
  const scrollRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (scrollRef) {
  //     scrollRef?.current?.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'end',
  //       inline: 'nearest',
  //     });
  //   }
  // }, [transactionList]);

  return (
    <Box className={classNames(`h-1/2 w-full`)}>
      <Typography align="center">호가창</Typography>
      <Box className="flex justify-around items-center font-bmjua">
        <Typography className="font-bmjua">가격({marketSymbol})</Typography>
        <Typography>수량({coinSymbol})</Typography>
      </Box>

      <Box
        sx={{
          height: 440,
        }}
        className={classNames(` overflow-y-scroll`)}
      >
        {orderBook?.ask
          .slice(0)
          .reverse()
          .map((item, index) => {
            return (
              <OrderbookRow
                key={item.p}
                price={item.p}
                quantity={item.q}
                orderType={'ask'}
                eventType={undefined}
              />
            );
          })}
        {orderBook?.bid.map((item, index) => {
          return (
            <OrderbookRow
              key={item.p}
              price={item.p}
              quantity={item.q}
              orderType={'bid'}
              eventType={undefined}
            />
          );
        })}

        {/* {drawData?.length > CONST_LOADING_CNT &&
          drawData?.map((item, index) => {
            let mEventType: 'ask' | 'bid' | undefined;
            const recentPrice =
              transaction.content.list[transaction.content.list.length - 1]
                .contPrice;

            if (recentPrice === item.price) {
              mEventType = item.orderType === 'ask' ? 'ask' : 'bid';
            }
            return (
              index < CONST_DISPALY_COUNT && (
                <OrderbookRow
                  price={item.price}
                  quantity={item.quantity}
                  orderType={item.orderType}
                  eventType={mEventType}
                />
              )
            );
          })} */}
      </Box>
    </Box>
  );
};

export default Orderbook;
