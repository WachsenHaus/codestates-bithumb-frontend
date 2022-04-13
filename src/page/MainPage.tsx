import { Container, Grid } from '@mui/material';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
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
import useChangeWebTitle from '../hooks/useChangeWebTitle';
import { useGenerateBitThumbSocket } from '../hooks/useWebSocket';

const MainPage = () => {
  useGenerateBitThumbSocket('ticker');
  useGenerateBitThumbSocket('transaction');
  useGenerateBitThumbSocket('orderbookdepth');
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
      <Header />
      <Container
        // disableGutters

        maxWidth={false}
        sx={{
          background: 'rgba(222,222,222,0.1)',
          // height: '100%',
          fontFamily: 'Courier',
          letterSpacing: '0.01rem',
        }}
      >
        <Grid
          container
          spacing={0}
          rowSpacing={0}
          // gridgutt
        >
          <Grid item xs={7}>
            <MainContent />
            <MainFooter />
          </Grid>
          <Grid item xs={5}>
            <MainSideBar />
          </Grid>
        </Grid>
        {/* <div
          style={{
            display: 'grid',
            width: '100%',
            height: '100%',
            gridTemplateRows: '7% auto 40%',
            gridTemplateColumns: '77% auto',
          }}
        >
            </div> */}
        {/* <MainHeader /> */}
      </Container>
    </>
  );
};

export default MainPage;
