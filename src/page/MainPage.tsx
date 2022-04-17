import { Box, Container, Grid } from '@mui/material';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import CoinBar from '../components/CoinBar/CoinBar';
import Header from '../components/Header/Header';
import MainContent from '../components/MainContent';
import MainFooter from '../components/MainFooter';
import Orderbook from '../components/Orderbook/Orderbook';
import Transaction from '../components/Transaction/Transaction';
import useChangeWebTitle from '../hooks/useChangeWebTitle';
import { useGetCoinList, useGetTradeData } from '../hooks/useGetCoinList';
import useResetObserverDrawData from '../hooks/useResetDrawData';
import { useGenerateBitThumbSocket } from '../hooks/useWebSocket';

const MainPage = () => {
  useGetCoinList();
  useGetTradeData();
  useGenerateBitThumbSocket('SUBSCRIBE');
  useResetObserverDrawData();

  //
  useChangeWebTitle();

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
          <CoinBar />
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
