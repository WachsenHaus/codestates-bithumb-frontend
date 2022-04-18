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
      <Typography align="center">체결내역</Typography>
      <Box className="flex justify-around items-center font-bmjua">
        <Typography className="font-bmjua">시간</Typography>
        <Typography className="font-bmjua">가격({marketSymbol})</Typography>
        <Typography>수량({coinSymbol})</Typography>
      </Box>
      <Box
        sx={{
          height: { sm: 200, md: 330 },
        }}
        className={classNames(`scrollbar-hide overflow-y-auto`)}
      >
        {drawTransaction
          .slice(0)
          .reverse()
          .map((item) => {
            return (
              <TransactionRow
                key={item.contDtm + '1'}
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
