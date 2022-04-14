import { Box, Container, Grid } from '@mui/material';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { atomGetCoinList } from '../atom/coinList.atom';
import {
  orderbookdepthSocketState,
  tickerSocketState,
  transactionSocketState,
} from '../atom/user.atom';
import Header from '../components/Header/Header';
import MainContent from '../components/MainContent';
import MainFooter from '../components/MainFooter';
import MainHeader from '../components/MainHeader';
import MainSideBar from '../components/MainSideBar';
import Orderbook from '../components/Orderbook/Orderbook';
import Transaction from '../components/Transaction/Transaction';
import useChangeWebTitle from '../hooks/useChangeWebTitle';
import useGetCoinList from '../hooks/useGetCoinList';

import { useGenerateBitThumbSocket } from '../hooks/useWebSocket';

const MainPage = () => {
  // useGenerateBitThumbSocket('ticker');
  // useGenerateBitThumbSocket('transaction');
  // useGenerateBitThumbSocket('orderbookdepth');
  useGenerateBitThumbSocket('SUBSCRIBE');
  useGetCoinList();

  // ();
  // useChangeWebTitle();

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

  //xs :0
  //sm :600
  //md:900
  //lg:1200
  //xl:1536
  return (
    <>
      <Box
        className={classNames(`grid grid-cols-12 h-screen`)}
        style={{
          gridTemplateRows: 'auto 1fr',
        }}
      >
        <Box gridColumn={`span 12`}>
          <Header />
        </Box>
        <Box gridColumn={`span 7`}>
          <MainContent />
          <MainFooter />
        </Box>
        <Box gridColumn={`span 5`}>
          <Orderbook />
          <Transaction />
        </Box>
      </Box>
    </>
  );
};

export default MainPage;
