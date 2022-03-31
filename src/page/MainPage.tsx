import classNames from 'classnames';
import React, { useEffect } from 'react';
import MainContent from '../components/MainContent';
import MainFooter from '../components/MainFooter';
import MainHeader from '../components/MainHeader';
import MainSiderBar from '../components/MainSiderBar';
import { useGenerateBitThumbSocket, useObserverWSMessage } from '../hooks/useWebSocket';

const MainPage = () => {
  /** init */
  //   const [_, setWebSocket] = useRecoilState(userWebSocketState);

  //   const bitThumbWs =
  useGenerateBitThumbSocket('ticker');
  // useGenerateBitThumbSocket('transaction');
  // useGenerateBitThumbSocket('orderbookdepth');
  useObserverWSMessage();
  //   useEffect(() => {
  //     bitThumbWs && setWebSocket(bitThumbWs);
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
