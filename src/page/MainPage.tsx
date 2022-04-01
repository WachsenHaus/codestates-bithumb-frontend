import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import {
  orderbookdepthSocketState,
  tickerSocketState,
  transactionSocketState,
} from '../atom/user.atom';
import MainContent from '../components/MainContent';
import MainFooter from '../components/MainFooter';
import MainHeader from '../components/MainHeader';
import MainSideBar from '../components/MainSideBar';
import useChangeWebTitle from '../hooks/useChangeWebTitle';
import { useGenerateBitThumbSocket } from '../hooks/useWebSocket';

const MainPage = () => {
  useGenerateBitThumbSocket('ticker');
  useGenerateBitThumbSocket('transaction');
  useGenerateBitThumbSocket('orderbookdepth');
  useChangeWebTitle();

  const tickerWs = useRecoilValue(tickerSocketState);
  const transactionWs = useRecoilValue(transactionSocketState);
  const orderbookWs = useRecoilValue(orderbookdepthSocketState);
  useEffect(() => {
    return () => {
      tickerWs?.close();
      transactionWs?.close();
      orderbookWs?.close();
    };
  }, []);

  return (
    <div
      className={classNames(`w-screen h-screen min-h-max min-w-max`)}
      style={{
        fontFamily: 'Courier',
        letterSpacing: '0.01rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          width: '100%',
          height: '100%',
          gridTemplateRows: '7% auto 40%',
          gridTemplateColumns: '80% auto',
        }}
      >
        <MainHeader />
        <MainContent />
        <MainFooter />

        <MainSideBar />
      </div>
    </div>
  );
};

export default MainPage;
