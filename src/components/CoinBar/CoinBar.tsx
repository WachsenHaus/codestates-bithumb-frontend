import classNames from 'classnames';
import { motion } from 'framer-motion';
import React from 'react';
import { convertStringPriceToKRW, convertStringPriceWON, convertStringToVolume24 } from '../../utils/utils';
import CoinRate from './CoinRate';
import useGetCoinBar from '../../hooks/useGetCoinBar';

const CoinColumn = React.memo(({ children }: { children: React.ReactNode }) => <div className={`flex flex-col justify-center items-center`}>{children}</div>);

const CoinBar = () => {
  const { e, v24, u24, h, l, f, r, coinSymbol } = useGetCoinBar();

  return (
    <motion.div className={classNames(`flex  justify-around items-center my-4`)}>
      <div className="font-bmjua">{coinSymbol}</div>
      <div>{convertStringPriceToKRW(e)}</div>
      <CoinRate rate={r} />
      <CoinColumn>
        <h1 className="font-bmjua">거래량(24H)</h1>
        <span>
          {convertStringToVolume24(v24)} {coinSymbol}
        </span>
      </CoinColumn>
      <CoinColumn>
        <h1 className="font-bmjua">거래금액(24H)</h1>
        <span>{convertStringPriceWON(u24)}</span>
      </CoinColumn>
      <CoinColumn>
        <h1 className="font-bmjua">고가(당일)</h1>
        <span>{convertStringPriceToKRW(h)}</span>
      </CoinColumn>
      <CoinColumn>
        <h1 className="font-bmjua">저가(당일)</h1>
        <span>{convertStringPriceToKRW(l)}</span>
      </CoinColumn>
      <CoinColumn>
        <h1 className="font-bmjua">전일종가</h1>
        <span>{convertStringPriceToKRW(f)}</span>
      </CoinColumn>
    </motion.div>
    // </AnimatePresence>
  );
};

export default React.memo(CoinBar);
