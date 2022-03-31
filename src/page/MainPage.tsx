import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { tickerState } from '../atom/ticker.atom';
import { useConnectBitThumb } from '../hooks/useWebSocket';

const MainPage = () => {
  /** init */
  const bitThumbWs = useConnectBitThumb();

  // const bitThumbWs = 'a';
  useEffect(() => {
    console.log('Connected');
  }, [bitThumbWs]);

  return <h1 className="text-3xl text-red-300">안녕하세요</h1>;
};

export default MainPage;
