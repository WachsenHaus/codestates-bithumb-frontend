import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { tickerState } from '../atom/ticker.atom';

/**
 *
 * @returns 빗썸 웹소켓과 연결하고 웹소켓 객체를 반환합니다.
 */
export const useConnectBitThumb = () => {
  const [ws, setWs] = useState<WebSocket>();
  const [isConnect, setIsConnect] = useState(false);
  const [userTicker, setUserTickerState] = useRecoilState(tickerState);
  console.log(userTicker);

  useEffect(() => {
    try {
      const ws = new WebSocket('wss://pubwss.bithumb.com/pub/ws');
      ws.onopen = (e) => {
        console.log(e);
        setIsConnect(true);
        setWs(ws);
      };
      ws.onerror = (error) => {
        console.error(error);
      };
      ws.onclose = (error) => {
        console.log(error);
      };
      ws.onmessage = (evt: MessageEvent) => {
        console.log(evt.data);
      };
    } catch (err) {
      console.error(err);
      setIsConnect(false);
    }
  }, []);

  useEffect(() => {
    if (isConnect) {
      console.log('연결되었습니다. 서버에 요청하겠습니다.');
      const ticker = JSON.stringify(userTicker);
      // const transaction = JSON.stringify({
      //   type: 'transaction',
      //   symbols: ['BTC_KRW', 'ETH_KRW'],
      // });
      // const orderbookdepth = JSON.stringify({
      //   type: 'orderbookdepth',
      //   symbols: ['BTC_KRW', 'ETH_KRW'],
      // });
      ws?.send(ticker);
    }
  }, [isConnect, ws]);
  return ws;
};

/**
 *
 * @param ws
 * @returns 웹소켓의 연결을 끊습니다.
 */
export const useDisconnectWebSocket = (ws: WebSocket) => {
  useEffect(() => {
    try {
      if (ws) {
        ws.close();
      }
    } catch (err) {
      console.error(err);
    }
  }, [ws]);
  return ws;
};
