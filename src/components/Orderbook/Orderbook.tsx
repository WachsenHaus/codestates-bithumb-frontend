import { Box, Typography } from '@mui/material';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Meter, Spinner } from 'grommet';
import produce from 'immer';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  orderbookdepthReceiveState,
  transactionReceiveState,
  OrderBookReceiverListType,
  TransactionReceiverListType,
  IOrderBookReceiverTypes,
} from '../../atom/user.atom';
import styles from './../animation.module.css';
import OrderbookRow from './OrderbookRow';

const CONST_DISPALY_COUNT = 30;
const CONST_LOADING_CNT = 16;

/**
 *
 * @returns 호가창 컴포넌트
 */
const Orderbook = () => {
  const or = useRecoilValue(orderbookdepthReceiveState);
  const transaction = useRecoilValue(transactionReceiveState);
  const [originData, setOriginData] = useState<OrderBookReceiverListType[]>([]);
  const [transactionList, setTransactionList] = useState<
    TransactionReceiverListType[]
  >([]);
  const [middleIndex, setMiddleIndex] = useState(-1);
  const [sortData, setSortData] = useState<OrderBookReceiverListType[]>([]);
  const [drawData, setDrawData] = useState<OrderBookReceiverListType[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef) {
      // scrollRef?.current?.scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'end',
      //   inline: 'nearest',
      // });
    }
  }, [transactionList]);

  /**
   * 호가창 함수
   */
  useEffect(() => {
    const {
      content: { list },
    } = or as IOrderBookReceiverTypes;
    if (list) {
      // 처음 데이터를 수신한다면
      if (originData.length === 0) {
        // 그냥 넣는다.
        if (list[0].symbol === '') {
          return;
        }
        setOriginData(list);
        return;
      }
    }
    if (list) {
      // 입력받은데이터와 원본 데이터를 이중비교하고 동일한 심볼과 가격이 있다면 엎어치기를함.
      const next = produce(originData, (draft) => {
        for (let i = 0; i < list.length; i++) {
          const { symbol, price, orderType, quantity } = list[i];
          if (price === '' || symbol === '') {
            break;
          }
          for (let j = 0; j < draft.length; j++) {
            try {
              if (draft[j].symbol === symbol && draft[j].price === price) {
                draft[j].orderType = orderType;
                draft[j].quantity = quantity;
                return;
              }
            } catch (err) {
              console.log(err);
            }
          }
          draft.push(list[i]);
          if (draft.length >= 1000) {
            draft.shift();
          }
        }
      });
      //원본데이터는 저장을한다.
      setOriginData(next);
    }
  }, [or]);

  /**
   * 체결가격이 들어온다면
   */
  useEffect(() => {
    const { list } = transaction.content;
    // 호가가격보다 체결가격이 먼저 들어왔다면
    if (originData.length === 0) {
      // 원본 배열에는 데이터를 계속 넣는다.
      if (list.length >= 1 && list[list.length - 1].symbol !== '') {
        const addOpenPrice: OrderBookReceiverListType = {
          price: list[list.length - 1].contPrice,
          orderType: 'bid',
          quantity: list[list.length - 1].contQty,
          symbol: list[list.length - 1].symbol,
          total: 'current',
        };
        console.log({ ...addOpenPrice });
        // 임의로 하나의 객체를 생성해서 넣음.
        setOriginData([addOpenPrice]);
        return;
      }
    }
    if (list) {
      const origin = produce(originData, (draft) => {
        //result 원본배열
        // 체결내역으로 들어온 객체로 원본데이터와 비교를함.
        for (let i = 0; i < list.length; i++) {
          const { symbol, contPrice, contQty, buySellGb } = list[i];

          for (let j = 0; j < draft.length; j++) {
            if (draft[j].symbol === symbol && draft[j].price === contPrice) {
              draft[j].orderType = buySellGb === '1' ? 'ask' : 'bid';
              draft[j].quantity = contQty;
              return;
            }
          }

          const addOpenPrice: OrderBookReceiverListType = {
            price: contPrice,
            orderType: buySellGb === '1' ? 'ask' : 'bid',
            quantity: contQty,
            symbol: symbol,
            total: 'current',
          };
          if (addOpenPrice.price === '') {
            return;
          }
          draft.push(addOpenPrice);
        }
      });
      setOriginData(origin);
    }
  }, [transaction.content]);

  /**
   * 값을 담는 오리지날 변수가 변경이 되었다면 그리기 위한 용도의 배열로 값을 변경하는 함수
   */
  useEffect(() => {
    const draw = produce(originData, (draft) => {
      draft.sort((a, b) => Number(b.price) - Number(a.price));
    });

    setSortData(draw);
  }, [originData]);

  /**
   * 인덱스만 찾는 훅스
   */
  useEffect(() => {
    const {
      content: { list },
    } = transaction;
    const index = sortData.findIndex(
      (item) => item.price === list[list.length - 1].contPrice
    );
    const a = list[list.length - 1].contPrice;
    // console.log(list[list.length - 1].contPrice);
    // 찾았다면
    if (index !== -1) {
      const next = produce(sortData, (draft) => {
        for (let i = 0; i < draft.length; i++) {
          if (i < index) {
            // 높은곳에 물량이 쌓인것은 매도니까 파란색
            draft[i].orderType = 'ask';
          } else {
            // 배열의 후순위쪽은 파란색
            draft[i].orderType = 'bid';
          }
        }
        const complement = Math.ceil(CONST_DISPALY_COUNT / 2);
        const left = index - complement;
        if (index > left) {
          draft.splice(0, left);
        }
      });
      setDrawData(next);
    }
    // else {
    //   console.log(a);
    //   console.log({ ...drawData });
    // }
  }, [sortData]);

  return (
    <Box className={classNames(`h-1/2 w-full`)}>
      <Typography align="center">호가창</Typography>
      <Box className="flex justify-around items-center font-bmjua">
        <Typography className="font-bmjua">가격(KRW)</Typography>
        <Typography>수량(DOGE)</Typography>
      </Box>

      <Box
        // alignContent="stretch"
        sx={{
          //   minHeight: '440px',
          height: 440,
          // flex: '1 1 auto',
          //   flex: '1 1 auto',
        }}
        className={classNames(` overflow-y-scroll`)}
      >
        {/* {drawData.length < CONST_LOADING_CNT && (
          <motion.div
            className="relative h-full w-full flex justify-center items-center"
            animate={{
              x: -100,
              opacity: drawData.length < CONST_LOADING_CNT ? 1 : 0,
            }}
            transition={{
              ease: 'backOut',
              delay: 200,
            }}
          >
            <Spinner
              message={'Loading Data'}
              size="xsmall"
              aria-label="meter"
            />
          </motion.div>
        )} */}

        {drawData?.length > CONST_LOADING_CNT &&
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
          })}
      </Box>
    </Box>
  );
};

export default Orderbook;
