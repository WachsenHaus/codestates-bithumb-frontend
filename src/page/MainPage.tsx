import classNames from 'classnames';
import React, { useEffect } from 'react';
import MainContent from '../components/MainContent';
import MainFooter from '../components/MainFooter';
import MainHeader from '../components/MainHeader';
import MainSiderBar from '../components/MainSiderBar';
import useChangeWebTitle from '../hooks/useChangeWebTitle';
import { useGenerateBitThumbSocket } from '../hooks/useWebSocket';

const MainPage = () => {
  /** init */
  // const [_, setWebSocket] = useRecoilState(atomSocketsState);

  //   const bitThumbWs =
  useGenerateBitThumbSocket('ticker');
  useGenerateBitThumbSocket('transaction');
  useGenerateBitThumbSocket('orderbookdepth');
  useChangeWebTitle();
  // useObserverWSMessage();
  //   useEffect(() => {
  //     bitThumbWs && setWebSocket(bitThumbWs);
  //   }, [bitThumbWs]);

  return (
    <div
      className={classNames(`grid w-screen h-screen`)}
      style={{
        gridTemplateRows: '7% auto 40%',
        gridTemplateColumns: '80% auto',
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
