import stringify from 'fast-json-stable-stringify';
import parse from 'fast-json-parse';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import produce from 'immer';
import {
  IOrderBookReceiverTypes,
  orderbookdepthReceiveState,
  orderbookdepthSenderState,
  orderbookdepthSocketState,
  SocketNamesType,
  tickerReceiveState,
  tickerSenderState,
  tickerSocketState,
  transactionReceiveState,
  transactionSenderState,
  transactionSocketState,
} from '../atom/user.atom';
import CONST from '../const';
import io, { Manager } from 'socket.io-client';
import { Windows } from 'grommet-icons';
import { writeSync } from 'fs';

/**
 *
 * @returns 빗썸 웹소켓과 연결하고 웹소켓 객체를 반환합니다.
 */
export const useGenerateBitThumbSocket = (type: SocketNamesType) => {
  const [wsTicker, setWsTicker] = useRecoilState(tickerSocketState);
  const [rcvTicker, setRcvTicker] = useRecoilState(tickerReceiveState);
  const [senderTicker, setSenderTicker] = useRecoilState(tickerSenderState);

  const [wsOrder, setWsOrder] = useRecoilState(orderbookdepthSocketState);
  const [rcvOrder, setRcvOrder] = useRecoilState(orderbookdepthReceiveState);
  const [senderOrder, setSenderOrder] = useRecoilState(
    orderbookdepthSenderState
  );

  const [wsTransaction, setWsTransaction] = useRecoilState(
    transactionSocketState
  );
  const [rcvTransaction, setRcvTransaction] = useRecoilState(
    transactionReceiveState
  );
  const [senderTransaction, setSenderTransaction] = useRecoilState(
    transactionSenderState
  );

  const generateOnError: any | null =
    (type: SocketNamesType) => (ev: Event) => {
      console.error(`Error WebSocket ${type} ${ev}`);
      console.error(ev);
    };
  const generateOnCloser: any | null =
    (type: SocketNamesType) => (ev: CloseEvent) => {
      console.info(`Close WebSocket ${type} ${ev}`);
      console.info(ev);
    };

  const generateOnMessage: any | null =
    (type: SocketNamesType) => (ev: MessageEvent<MessageEvent>) => {
      if (ev) {
        const resultData = parse(ev.data).value;
        if (resultData.status === '0000') {
          return;
        }
        // console.log(resultData);
        switch (type) {
          case 'ticker':
            setRcvTicker(resultData);
            break;
          case 'orderbookdepth':
            const data = resultData as IOrderBookReceiverTypes;
            const next = produce(data, (draft) => {
              draft.content.list.sort(
                (a, b) => Number(b.price) - Number(a.price)
              );
            });

            setRcvOrder(next);
            break;
          case 'transaction':
            setRcvTransaction(resultData);

            break;
          default:
            break;
        }
        // setMessage(resultData);
      }
    };

  useEffect(() => {
    if (wsTicker) {
      const d = stringify(senderTicker);
      console.log(d);
      wsTicker.send(d);
    }
  }, [senderTicker]);
  useEffect(() => {
    if (wsTransaction) {
      const d = stringify(senderTransaction);
      console.log(d);
      wsTransaction.send(d);
    }
  }, [senderTransaction]);
  useEffect(() => {
    if (wsOrder) {
      const d = stringify(senderOrder);
      console.log(d);
      wsOrder.send(d);
    }
  }, [senderOrder]);
  /** 유저아톰이 가지고있는 소켓 배열에 추가해준다. */

  useEffect(() => {
    try {
      const ws = new WebSocket('wss://pubwss.bithumb.com/pub/ws');
      switch (type) {
        case 'ticker':
          ws.onopen = (e) => {
            console.log(`Connected WebSocket ${type}`);
            if (wsTicker) {
              wsTicker.close();
              console.warn(`Exist ${type} Socket`);
            }
            setWsTicker(ws);
            ws.send(stringify(senderTicker));
          };
          ws.onerror = generateOnError(type);
          ws.onclose = generateOnCloser(type);
          ws.onmessage = generateOnMessage(type);

          break;
        case 'transaction':
          ws.onopen = (e) => {
            console.log(`Connected WebSocket ${type}`);
            if (wsTransaction) {
              wsTransaction.close();
              console.warn(`Exist ${type} Socket`);
            }
            setWsTransaction(ws);
            ws.send(stringify(senderTransaction));
          };
          ws.onerror = generateOnError(type);
          ws.onclose = generateOnCloser(type);
          ws.onmessage = generateOnMessage(type);

          break;
        case 'orderbookdepth':
          ws.onopen = (e) => {
            console.log(`Connected WebSocket ${type}`);
            if (wsOrder) {
              wsOrder.close();
              console.warn(`Exist ${type} Socket`);
            }
            setWsOrder(ws);
            ws.send(stringify(senderOrder));
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
  }, []);
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
