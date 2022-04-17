import { Box } from '@mui/material';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import produce from 'immer';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { atomDrawTransaction } from '../../atom/drawData.atom';
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
  const [transactionList, setTransactionList] = useState<
    TransactionReceiverListType[]
  >([]);

  const drawTransaction = useRecoilValue(atomDrawTransaction);

  useEffect(() => {
    if (scrollRef) {
      // scrollRef?.current?.scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'end',
      //   inline: 'nearest',
      // });
    }
  }, [transactionList]);

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
      {drawTransaction.length > 10 &&
        drawTransaction
          .slice(0)
          .reverse()
          .map((item, index) => {
            return (
              <motion.div
                // key={item.contDtm}
                ref={index === drawTransaction.length - 1 ? scrollRef : null}
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
                      item.buySellGb === '2' ? 'text-red-400' : 'text-blue-400'
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
