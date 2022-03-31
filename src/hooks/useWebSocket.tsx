import stringify from 'fast-json-stable-stringify';
import parse from 'fast-json-parse';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import produce from 'immer';
import { userState } from '../atom/orderbookDepth.atom';
import { atomTickerState } from '../atom/ticker.atom';
import {
  atomFixSocketsState,
  atomSimbolsState,
  atomSocketsState,
  atomWebSocketState,
  IOrderBookReceiverTypes,
  ITickerReceiverTypes,
  ITransactionReceiverTypes,
  SocketNamesType,
  SocketType,
} from '../atom/user.atom';
import CONST from '../const';
import io, { Manager } from 'socket.io-client';
import { Windows } from 'grommet-icons';

/**
 *
 * @returns 빗썸 웹소켓과 연결하고 웹소켓 객체를 반환합니다.
 */
export const useGenerateBitThumbSocket = (type: SocketNamesType) => {
  const [isConnect, setIsConnect] = useState(false);
  const userSocket = useRecoilValue(atomSocketsState);
  const setSockets = useSetRecoilState(atomSocketsState);
  const [message, setMessage] = useState<any>();

  useEffect(() => {
    const next = produce(userSocket, (draftState) => {
      draftState.forEach((item) => {
        if (item.identifiler === type) {
          item.receiverType = message;
        }
      });
    });
    setSockets(next);
  }, [message]);

  const generateOnError: any | null = (type: SocketNamesType) => (ev: Event) => {
    console.error(`Error WebSocket ${type} ${ev}`);
    console.error(ev);
  };
  const generateOnCloser: any | null = (type: SocketNamesType) => (ev: CloseEvent) => {
    console.info(`Close WebSocket ${type} ${ev}`);
    console.info(ev);
  };

  const generateOnMessage: any | null = (type: SocketNamesType) => (ev: MessageEvent<MessageEvent>) => {
    if (ev) {
      const resultData = parse(ev.data).value;
      if (resultData.status === '0000') {
        return;
      }
      setMessage(resultData);
    }
  };

  /** 유저아톰이 가지고있는 소켓 배열에 추가해준다. */

  useEffect(() => {
    try {
      const ws = new WebSocket('wss://pubwss.bithumb.com/pub/ws');
      switch (type) {
        case 'ticker':
          ws.onopen = (e) => {
            console.log(`Connected WebSocket ${type}`);
            if (userSocket.filter((item) => item.identifiler === type).length > 0) {
              ws.close();
              console.warn(`Exist ${type} Socket`);
              return;
            }
            const ticker: SocketType = {
              identifiler: 'ticker',
              ws: ws,
              senderType: CONST.DEFAULT_TICKER_SOCKET,
              receiverType: CONST.DEFAULT_TICKER_RECEIV_DATA,
            };
            setSockets((prevData) => {
              return [...prevData, ticker];
            });
          };

          ws.onerror = generateOnError(type);
          ws.onclose = generateOnCloser(type);
          ws.onmessage = generateOnMessage(type);

          break;
        case 'transaction':
          ws.onopen = (e) => {
            console.log(`Connected WebSocket ${type}`);
            setIsConnect(true);
            if (userSocket.filter((item) => item.identifiler === type).length > 0) {
              ws.close();
              console.warn(`Exist ${type} Socket`);
              return;
            }
            const transaction: SocketType = {
              identifiler: 'transaction',
              ws: ws,
              senderType: CONST.DEFAULT_TRANSACTION_SOCKET,
              receiverType: CONST.DEFAULT_TRANSACTION_RECEIV_DATA,
            };
            setSockets((prevData) => {
              // console.log(prevData);
              return [...prevData, transaction];
            });
          };
          ws.onerror = generateOnError(type);
          ws.onclose = generateOnCloser(type);
          ws.onmessage = generateOnMessage(type);
          break;
        case 'orderbookdepth':
          ws.onopen = (e) => {
            console.log(`Connected WebSocket ${type}`);
            setIsConnect(true);
            if (userSocket.filter((item) => item.identifiler === type).length > 0) {
              ws.close();
              console.warn(`Exist ${type} Socket`);
              return;
            }
            const orderbookdepth: SocketType = {
              identifiler: 'orderbookdepth',
              ws: ws,
              senderType: CONST.DEFAULT_ORDERBOOK_DEPTH_SOCKET,
              receiverType: CONST.DEFAULT_ORDERBOOK_DEPTH_RECEIV_DATA,
            };
            setSockets((prevData) => {
              // console.log(prevData);
              return [...prevData, orderbookdepth];
            });
          };
          ws.onerror = generateOnError(type);
          ws.onclose = generateOnCloser(type);
          ws.onmessage = generateOnMessage(type);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }, [type]);

  useEffect(() => {
    if (isConnect) {
      console.log('연결되었습니다. 서버에 요청하겠습니다.');
      // const ticker = JSON.stringify(userTicker);
      // const transaction = JSON.stringify({
      //   type: 'transaction',
      //   symbols: ['BTC_KRW', 'ETH_KRW'],
      // });
      // const orderbookdepth = JSON.stringify({
      //   type: 'orderbookdepth',
      //   symbols: ['BTC_KRW', 'ETH_KRW'],
      // });
      // ws?.send(ticker);
    }
  }, [isConnect]);

  useEffect(() => {
    // console.log(userSocket);
  }, [userSocket]);
};

/**
 *
 * @returns 웹소켓에 보내지는 객체가 변경될때 마다 자동으로 웹소켓에게 데이터를 전송합니다.
 */
export const useObserverWSMessage = () => {
  const [userSocket, setUserSockets] = useRecoilState(atomSocketsState);
  useEffect(() => {
    try {
      userSocket.forEach((item) => {
        const key = item.identifiler;
        switch (key) {
          case 'ticker':
            const ticker = stringify(item.senderType);
            item.ws?.send(ticker);
            break;
          case 'transaction':
            const transaction = stringify(item.senderType);
            item.ws?.send(transaction);
            break;
          case 'orderbookdepth':
            const orderbookdepth = stringify(item.senderType);
            item.ws?.send(orderbookdepth);
            break;
          default:
            break;
        }
      });
    } catch (err) {
      console.error(err);
    }
  }, [userSocket]);
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
