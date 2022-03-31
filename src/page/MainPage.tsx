import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { tickerState } from '../atom/ticker.atom';
import MainContent from '../components/MainContent';
import MainFooter from '../components/MainFooter';
import MainHeader from '../components/MainHeader';
import MainSiderBar from '../components/MainSiderBar';
import { useConnectBitThumb } from '../hooks/useWebSocket';

const MainPage = () => {
  /** init */
  //   const bitThumbWs = useConnectBitThumb();
  //   useEffect(() => {
  //     console.log('Connected');
  //   }, [bitThumbWs]);

  return (
    <div
      className={classNames(`grid w-screen h-screen`)}
      style={{
        display: 'grid',
        gridTemplateRows: '7% auto 40%',
        gridTemplateColumns: '80% 40%',
      }}
    >
      <MainHeader />
      <MainContent />
      <MainFooter />
      <MainSiderBar />
    </div>
  );
};

export default MainPage;
