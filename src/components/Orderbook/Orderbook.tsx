import { Box, Skeleton, Typography } from '@mui/material';
import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { atomDrawCoinInfo } from '../../atom/drawData.atom';
import { atomOrderBook, TypeOrderObj } from '../../atom/orderBook.atom';

import { atomSelectCoinDefault } from '../../atom/selectCoinDefault.atom';
import { atomSelectCoinDetail } from '../../atom/selectCoinDetail.atom';
import { atomFinalTransaction } from '../../atom/total.atom';
import { TypeTradeTransaction } from '../../atom/tradeData.atom';
import { useGetOrderBookInterval } from '../../hooks/useOrderBook';
import OrderbookRow from './OrderbookRow';

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

  return lastMaxValue.toString();
};

const getRateOfChange = (f: string | undefined, e: string) => {
  if (f === undefined || f === '' || e === '') {
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
};

/**
 *
 * @param q 수량
 * @param maxQ 기준이 되는 최대수량
 * @returns 퍼센테이지를 반환합니다.
 */
const getQuantityRatio = (q: string, maxQ: string) => {
  return ((Number(q) / Number(maxQ)) * 100).toString();
};

/**
 *
 * @param transaction
 * @param basePrice
 * @returns 호가창안에 트랜잭션과 동일한 금액이 존재한다면 bid, ask를 반환합니다.
 */
const getEventType = (transaction: TypeTradeTransaction, basePrice: string) => {
  if (transaction.contPrice === basePrice) {
    return transaction.buySellGb === '2' ? 'bid' : 'ask';
  }
};

/**
 *
 * @returns orderBook에서 가장 많은 코인수량을 계산합니다.
 */
const useGetMaxQuantity = () => {
  const [maxQuantity, setMaxQuantity] = useState('0');
  const orderBook = useRecoilValue(atomOrderBook);

  const calc = async () => {
    const result = await calcQuantity(orderBook.ask, orderBook.bid);
    setMaxQuantity(result);
  };
  useEffect(() => {
    calc();
  }, [orderBook]);

  return maxQuantity;
};

/**
 *
 * @returns 데이터를 불러오는 중이라면 boolean값을 반환합니다.
 */
const useGetLoadingState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const orderBook = useRecoilValue(atomOrderBook);
  useEffect(() => {
    if (orderBook.ask.length > 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [orderBook]);
  return isLoading;
};

/**
 *
 * @returns 트랜잭션중에 마지막으로 들어온값을 반환합니다.
 */
const useGetLastTransaction = () => {
  const transaction = useRecoilValue(atomFinalTransaction);
  const [lastTransaction, setLastTransaction] = useState<TypeTradeTransaction>({
    crncCd: 'C0100',
    coinType: '',
    buySellGb: '',
    contPrice: '',
    contQty: '',
    contAmt: '',
    contDtm: '',
  });
  useEffect(() => {
    const lastTransaction = transaction[transaction.length - 1];
    if (lastTransaction === undefined) {
      return;
    }
    setLastTransaction(lastTransaction);
  }, [transaction]);

  return lastTransaction;
};

/**
 *
 * @returns 호가창 컴포넌트
 */
const Orderbook = () => {
  useGetOrderBookInterval();

  const orderBook = useRecoilValue(atomOrderBook);
  const { marketSymbol, coinSymbol } = useRecoilValue(atomSelectCoinDefault);
  const { f } = useRecoilValue(atomSelectCoinDetail);

  const isLoading = useGetLoadingState();
  const maxQuantity = useGetMaxQuantity();
  const lastTransaction = useGetLastTransaction();

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
            return (
              <OrderbookRow
                key={index}
                price={item.p}
                quantity={item.q}
                orderType={'ask'}
                r={getRateOfChange(f, item.p)}
                quantityRatio={getQuantityRatio(item.q, maxQuantity)}
                eventType={getEventType(lastTransaction, item.p)}
              />
            );
          })}
        {orderBook?.bid?.map((item, index) => {
          return (
            <OrderbookRow
              key={index}
              index={index}
              price={item.p}
              quantity={item.q}
              orderType={'bid'}
              r={getRateOfChange(f, item.p)}
              quantityRatio={getQuantityRatio(item.q, maxQuantity)}
              eventType={getEventType(lastTransaction, item.p)}
            />
          );
        })}
        {isLoading === false && <Skeleton height={'100%'} animation="wave" />}
      </Box>
    </Box>
  );
};

export default Orderbook;
