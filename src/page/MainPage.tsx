import { Box, Container, Grid } from '@mui/material';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import CoinBar from '../components/CoinBar/CoinBar';
import Header from '../components/Header/Header';
import MainContent from '../components/MainContent';
import Orderbook from '../components/Orderbook/Orderbook';
import Ticker from '../components/Ticker/Ticker';
import Transaction from '../components/Transaction/Transaction';
import useChangeWebTitle from '../hooks/useChangeWebTitle';
import { useGetCoinList, useGetTradeData } from '../hooks/useGetCoinList';
import useResetObserverDrawData from '../hooks/useResetDrawData';
import { useGenerateBitThumbSocket } from '../hooks/useWebSocket';
import { Routes, Route, useParams } from 'react-router-dom';
import useGetTradeParam from '../hooks/useGetTradeParam';
import { useRecoilState } from 'recoil';
import { atomCommonConfig } from '../atom/commonConfig.atom';

const MainPage = () => {
  // 1. 코인의 정보를 받아온다.

  // 1.1 받아온 코인의 정보를 필터링을 한다. (한화 마켓만 사용하고, 즐겨찾기 등록된애들은 별표표시를 넣어줌)

  // 2. url에서 코인정보를 분석한다.

  // 2.1 분석된 코인정보로 상세 정보를 받아온다.

  // 2.2 상세 정보를 분석하여, draw atom(티커,트랜지션,코인바)에 값을 할당한다.

  //-------------------------------------

  // 3. 웹소켓을 실행한다.

  // 4. 웹소켓에서 들어오는 st, tr, tk를 분석하여 draw atom에 할당한다.

  // 5.차트는 차트 컴포넌트에서 선택된 코인타입,차트시간,siseCrncCd를 기준으로 인터벌로 받아온다.
  // 6.호가창도 orderbook컴포넌트에서 인터벌로 받아온다. 선택된 코인심볼,마켓심볼이 기준이다.

  // 1.코인정보를 받아옴
  useGetCoinList();

  useGetTradeParam();

  // 2.처음 디스플레이되는 거래 데이터들을 받아옴.
  useGetTradeData();
  // 3.웹소켓을 실행시킴 웹소켓은 트랜잭션,티커,차트봉에 대한 정보를 받아온다.
  useGenerateBitThumbSocket('SUBSCRIBE');
  // 4.선택된 코인에 대한 정보가 바뀌면 그리는 데이터들을 초기화하는 옵저버.
  useResetObserverDrawData();
  // 5.선택된 코인에 따라 가격정보가 해당 웹타이틀에 표시되는 훅스
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
          <Ticker />
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
