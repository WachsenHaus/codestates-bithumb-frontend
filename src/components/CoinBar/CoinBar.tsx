import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { atomDrawCoinInfo } from '../../atom/drawData.atom';
import { atomSelectCoin } from '../../atom/selectCoin.atom';
import {
  ConvertStringPriceToKRW,
  ConvertStringToVolume24,
} from '../../utils/utils';
import CoinRate from './CoinRate';

const CoinColumn = ({ children }: { children: React.ReactNode }) => (
  <div className={`flex flex-col justify-center items-center`}>{children}</div>
);

const CoinBar = () => {
  const { coinSymbol, r, e, v24, u24, h, l, f, siseCrncCd } =
    useRecoilValue(atomDrawCoinInfo);
  return (
    // <AnimatePresence initial={false}>
    <motion.div
      // key={coinSymbol}
      className={classNames(`flex  justify-around items-center`)}
      // initial={{
      //   x: -200,
      //   opacity: 0,
      // }}
      // animate={{
      //   x: 0,
      //   opacity: 1,
      // }}
      // transition={{ type: 'tween' }}
    >
      <div>{coinSymbol}</div>
      <div>{ConvertStringPriceToKRW(e)}</div>
      <CoinRate rate={r} />
      <CoinColumn>
        <h1>거래량(24H)</h1>
        <span>
          {ConvertStringToVolume24(v24)}
          {coinSymbol}
        </span>
      </CoinColumn>
      <CoinColumn>
        <h1>거래금액(24H)</h1>
        <span>
          {Math.floor(Number(u24))}
          {siseCrncCd}
        </span>
      </CoinColumn>
      <CoinColumn>
        <h1>고가(당일)</h1>
        <span>{ConvertStringPriceToKRW(h)}</span>
      </CoinColumn>
      <CoinColumn>
        <h1>저가(당일)</h1>
        <span>{ConvertStringPriceToKRW(l)}</span>
      </CoinColumn>
      <CoinColumn>
        <h1>전일종가</h1>
        <span>{ConvertStringPriceToKRW(f)}</span>
      </CoinColumn>
    </motion.div>
    // </AnimatePresence>
  );
};

export default CoinBar;
