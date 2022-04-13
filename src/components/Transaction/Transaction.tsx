import { Box } from '@mui/material';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import produce from 'immer';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  orderbookdepthReceiveState,
  transactionReceiveState,
  OrderBookReceiverListType,
  TransactionReceiverListType,
} from '../../atom/user.atom';

/**
 *
 * @returns 실시간 체결내역 컴포넌트
 */
const Transaction = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const or = useRecoilValue(orderbookdepthReceiveState);
  const transaction = useRecoilValue(transactionReceiveState);
  const [originData, setOriginData] = useState<OrderBookReceiverListType[]>([]);
  const [transactionList, setTransactionList] = useState<
    TransactionReceiverListType[]
  >([]);
  const [middleIndex, setMiddleIndex] = useState(-1);
  const [sortData, setSortData] = useState<OrderBookReceiverListType[]>([]);
  const [drawData, setDrawData] = useState<OrderBookReceiverListType[]>([]);

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

  return (
    <Box className="h-1/2">
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
      {transactionList.length > 10 &&
        transactionList.map((item, index) => {
          return (
            <motion.div
              ref={index === transactionList.length - 1 ? scrollRef : null}
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
                    item.updn === 'up' ? 'text-red-400' : 'text-blue-400'
                  } flex justify-center items-center"`
                )}
              >
                <span>{Number(item.contQty).toFixed(4)}</span>
              </div>
            </motion.div>
          );
        })}
    </Box>
  );
};

export default Transaction;
