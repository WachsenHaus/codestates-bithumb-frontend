import { Box, Container, Grid } from '@mui/material';
import classNames from 'classnames';
import { Transaction } from 'grommet-icons';
import React, { useEffect } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { atomGetCoinList } from '../atom/coinList.atom';
import Header from '../components/Header/Header';
import MainContent from '../components/MainContent';
import MainFooter from '../components/MainFooter';
import Orderbook from '../components/Orderbook/Orderbook';
import useGetCoinList from '../hooks/useGetCoinList';
import { useGenerateBitThumbSocket } from '../hooks/useWebSocket';

const MainPage = () => {
  useGenerateBitThumbSocket('SUBSCRIBE');
  useGetCoinList();

  //
  // useChangeWebTitle();

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
