import { Box, Button, Clock, Heading, Meter, Spinner, Text } from 'grommet';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// import { OrderBook, TradeHistory } from 'react-trading-ui';
import { useRecoilValue } from 'recoil';
import { Doughnut, Bar } from 'react-chartjs-2';

import {
  IOrderBookReceiverTypes,
  orderbookdepthReceiveState,
  OrderBookReceiverListType,
  TransactionReceiverListType,
  transactionReceiveState,
} from '../atom/user.atom';
import classNames from 'classnames';
import produce from 'immer';
import moment from 'moment';
import { motion } from 'framer-motion';
import codestates from '../asset/img/codestates-ci.png';
import styles from './animation.module.css';
import { Item } from 'framer-motion/types/components/Reorder/Item';
import { quickSort } from '../utils/utils';

const CONST_DISPALY_COUNT = 30;
const CONST_LOADING_CNT = 16;

const MainSideBar = () => {
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
      scrollRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [transactionList]);
  /**
   * 체결내역 함수
   */
  useEffect(() => {
    const { list } = transaction.content;
    if (list) {
      if (transactionList.length === 0) {
        setTransactionList(list);
        return;
      }
      const next = produce(transactionList, (draft) => {
        //result 원본배열
        for (let i = 0; i < list.length; i++) {
          const { symbol } = list[i];
          for (let j = 0; j < draft.length; j++) {
            if (draft[j].symbol !== symbol) {
              draft.splice(0);
              return;
            }
          }
          draft.push(list[i]);
          if (draft.length >= 40) {
            draft.shift();
          }
        }
      });
      setTransactionList(next);
    }
  }, [transaction.content.list]);

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
    console.time('sort');
    const draw = produce(originData, (draft) => {
      // const reuslt = quickSort(draft);
      // return reuslt;
      draft.sort((a, b) => Number(b.price) - Number(a.price));
    });
    console.timeEnd('sort');
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
    } else {
      console.log(a);
      console.log({ ...drawData });
    }
  }, [sortData]);

  return (
    <div
      style={{
        gridRowStart: 1,
        gridRowEnd: -1,
        gridColumnStart: 2,
        gridColumnEnd: -1,
        width: '100%',
        height: '100%',
      }}
    >
      <div
        className="grid "
        style={{
          height: '100%',
          gridTemplateColumns: '50% auto',
          gridTemplateRows: '7% auto',
        }}
      >
        {/* 사이드 헤더 */}
        <div
          style={{
            gridRowStart: 1,
            gridRowEnd: 1,
            gridColumnStart: 1,
            gridColumnEnd: 2,
          }}
        >
          <div className="w-full h-full flex justify-center items-center">
            <h1
              style={{
                fontFamily: 'bmjua',
              }}
            >
              가격 (KRW)
            </h1>
          </div>
        </div>
        <div
          style={{
            gridRowStart: 1,
            gridRowEnd: 1,
            gridColumnStart: 2,
            gridColumnEnd: 3,
          }}
        >
          <div className="w-full h-full flex justify-center items-center">
            <h1
              style={{
                fontFamily: 'bmjua',
              }}
            >
              수량 (BTC)
            </h1>
          </div>
        </div>

        {/* 사이드 본문 */}
        <div
          style={{
            display: 'grid',
            gridRowStart: 2,
            gridRowEnd: -1,
            gridColumnStart: 1,
            gridColumnEnd: -1,
            height: '100%',
            width: '100%',
            gridTemplateRows: '57% auto',
          }}
        >
          <div
            className="h-full"
            style={{
              height: '530px',
              overflowY: 'scroll',
              minHeight: '530px',
              maxHeight: 'auto',
            }}
          >
            {drawData.length < CONST_LOADING_CNT && (
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
            )}

            {drawData.length > CONST_LOADING_CNT &&
              drawData.map((item, index) => {
                return (
                  index < CONST_DISPALY_COUNT && (
                    <div className="grid grid-cols-2 grid-rows-1 px-8">
                      <motion.div
                        className={classNames(
                          `flex  justify-start items-center`,
                          `${
                            item.orderType === 'ask'
                              ? 'text-blue-400'
                              : 'text-red-400'
                          }`
                        )}
                      >
                        <span
                          className={classNames(
                            `${
                              item.orderType === 'ask' &&
                              transaction.content.list[
                                transaction.content.list.length - 1
                              ].contPrice === item.price
                                ? `${styles.askEffect}`
                                : ''
                            }`,
                            `${
                              item.orderType === 'bid' &&
                              transaction.content.list[
                                transaction.content.list.length - 1
                              ].contPrice === item.price
                                ? `${styles.bidEffect}`
                                : ''
                            }`
                          )}
                        >
                          {Number(item.price).toLocaleString('ko-kr')}
                        </span>
                      </motion.div>
                      <div className="flex justify-evenly items-center">
                        <Meter
                          size="xsmall"
                          thickness="xsmall"
                          color="orange"
                          margin={{
                            left: '-70px',
                          }}
                          value={Number(item.quantity) * 50}
                        />
                        <span className="ml-5">
                          {Number(item.quantity).toFixed(4)}
                        </span>
                      </div>
                    </div>
                  )
                );
              })}
          </div>
          <div className="flex flex-col justify-center h-full">
            <h1
              className="text-2xl flex justify-center items-center"
              style={{
                fontFamily: 'bmjua',
              }}
            >
              체결 내역
            </h1>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '30% 40% auto',
                gridTemplateRows: 'auto',
              }}
            >
              <h1
                style={{
                  fontFamily: 'bmjua',
                }}
                className="w-full flex justify-center items-center"
              >
                시간
              </h1>
              <h1
                style={{
                  fontFamily: 'bmjua',
                }}
                className="w-full flex justify-center items-center"
              >
                가격
              </h1>
              <h1
                style={{
                  fontFamily: 'bmjua',
                }}
                className="w-full flex justify-center items-center"
              >
                수량(BTC)
              </h1>
            </div>
            <div className="h-64 overflow-scroll overflow-x-hidden">
              {transactionList.length < 10 && (
                <motion.div
                  className="relative h-full w-full flex justify-center items-center"
                  animate={{
                    x: -100,
                    opacity: transactionList.length < 10 ? 1 : 0,
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
              )}
              {transactionList.length > 10 &&
                transactionList.map((item, index) => {
                  return (
                    <motion.div
                      ref={
                        index === transactionList.length - 1 ? scrollRef : null
                      }
                      style={{
                        display: 'grid',
                        height: '30px',
                        gridTemplateColumns: '30% 40% 30%',
                      }}
                    >
                      <div className="flex justify-center items-center">
                        {moment(item.contDtm).format('HH:mm:ss')}
                      </div>
                      <div className="flex justify-center items-center">
                        {Number(item.contPrice).toLocaleString('ko-kr')}
                      </div>
                      <div
                        className={classNames(
                          `${
                            item.updn === 'up'
                              ? 'text-red-400'
                              : 'text-blue-400'
                          } flex justify-center items-center"`
                        )}
                      >
                        <span>{Number(item.contQty).toFixed(4)}</span>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
            <div
              className="flex justify-center items-center  bg-no-repeat bg-contain"
              style={{
                width: '100%',
                height: '30px',
                backgroundPosition: '240px 0px',

                backgroundImage: `url(${codestates})`,
              }}
            >
              최영훈
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MainSideBar;
