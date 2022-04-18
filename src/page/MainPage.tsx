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
  // 1.코인정보를 받아옴
  useGetCoinList();
  // 2.처음 디스플레이되는 거래 데이터들을 받아옴.
  useGetTradeData();
  // 3.웹소켓을 실행시킴 웹소켓은 트랜잭션,티커,차트봉에 대한 정보를 받아온다.
  useGenerateBitThumbSocket('SUBSCRIBE');
  // 4.선택된 코인에 대한 정보가 바뀌면 그리는 데이터들을 초기화하는 옵저버.
  useResetObserverDrawData();

  // 5.선택된 코인에 따라 가격정보가 해당 웹타이틀에 표시되는 훅스
  useChangeWebTitle();

  // aa();

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
