import { Box, Typography } from '@mui/material';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { atomDrawTransaction } from '../../atom/drawData.atom';
import { atomSelectCoin } from '../../atom/selectCoin.atom';

import TransactionRow from './TransactionRow';

/**
 *
 * @returns 실시간 체결내역 컴포넌트
 */
const Transaction = () => {
  const drawTransaction = useRecoilValue(atomDrawTransaction);
  const { coinSymbol, marketSymbol } = useRecoilValue(atomSelectCoin);

  return (
    <Box className={classNames(`w-full`)}>
      <Box
        className={classNames(
          `py-4`,
          `font-bmjua`,
          `shadow-sm flex flex-col items-stretch`
        )}
      >
        <p className="text-center">체결내역</p>
        <Box className="mt-4 flex justify-around items-center text-sm">
          <p>시간</p>
          <p>가격({marketSymbol})</p>
          <p>수량({coinSymbol})</p>
        </Box>
      </Box>

      <Box
        sx={{
          height: { sm: 200, md: 250 },
        }}
        className={classNames(`scrollbar-hide overflow-y-auto`)}
      >
        {drawTransaction
          .slice(0)
          .reverse()
          .map((item, index) => {
            return (
              <TransactionRow
                coinSymbol={coinSymbol}
                key={index}
                time={item.contDtm}
                price={item.contPrice}
                contQty={item.contQty}
                buySellGb={item.buySellGb}
              />
            );
          })}
      </Box>
    </Box>
  );
};

export default Transaction;
