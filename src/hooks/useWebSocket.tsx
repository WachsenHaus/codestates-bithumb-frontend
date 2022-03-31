import React, { useEffect, useState } from 'react';

/**
 *
 * @returns 빗썸 웹소켓과 연결하고 웹소켓 객체를 반환합니다.
 */
export const useConnectBitThumb = () => {
  const [ws, setWs] = useState<WebSocket>();
  const [isConnect, setIsConnect] = useState(false);

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
      //   console.log('연결되었습니다. 서버에 요청하겠습니다.');
      //   const data = JSON.stringify({
      //     type: 'ticker',
      //     symbols: ['BTC_KRW', 'ETH_KRW'],
      //     tickTypes: ['30M', '1H', '12H', '24H', 'MID'],
      //   });
      //   ws?.send(data);
    }
  }, [isConnect]);
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
