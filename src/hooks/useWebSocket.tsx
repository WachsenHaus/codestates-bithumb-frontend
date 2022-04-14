import stringify from 'fast-json-stable-stringify';
import parse from 'fast-json-parse';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import produce from 'immer';
import { SocketNamesType } from '../atom/user.atom';
import {
  atomSubscribeWebSocektMessage,
  atomSubscribeWebSocket,
  atomTicker,
} from '../atom/ws.atom';
import {
  TypeWebSocketSubscribeReturnType,
  TypeWebSocketTickerReturnType,
} from '../atom/ws.type';
import { atomDrawTicker } from '../atom/drawData.atom';

/**
 *
 * @returns 빗썸 웹소켓과 연결하고 웹소켓 객체를 반환합니다.
 */
export const useGenerateBitThumbSocket = (type: SocketNamesType) => {
  const [wsSubscribe, setWsSubscribe] = useRecoilState(atomSubscribeWebSocket);
  const [wsMessage, setWsMessage] = useRecoilState(
    atomSubscribeWebSocektMessage
  );
  const [ticker, setTicker] = useRecoilState(atomTicker);
  const [drawTicker, setDrawTicker] = useRecoilState(atomDrawTicker);
  const [tickerObj, setTickerObj] = useState<TypeWebSocketTickerReturnType>();
  const [stObj, setStObj] = useState();
  const [transactionObj, setTransactionObj] = useState();

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
    (nameType: SocketNamesType) =>
    (ev: MessageEvent<TypeWebSocketSubscribeReturnType>) => {
      if (ev) {
        const { subtype, type, content }: TypeWebSocketSubscribeReturnType =
          parse(ev.data).value;
        switch (nameType) {
          case 'SUBSCRIBE':
            if (type === 'data') {
              if (subtype === 'tk') {
                setTickerObj(content);
              } else if (subtype === 'st') {
                setStObj(content);
              } else if (subtype === 'tr') {
                setTransactionObj(content);
              }
            }
            break;
          default:
            break;
        }
      }
    };

  const generateOnOpen: any | null =
    (type: SocketNamesType, ws: WebSocket) => (ev: Event) => {
      if (ev) {
        console.log(`Connected WebSocket ${type}`);
        switch (type) {
          case 'SUBSCRIBE':
            if (wsSubscribe) {
              wsSubscribe.close();
              console.warn(`Exist ${type} Socket`);
            }
            if (wsSubscribe?.CLOSED || wsSubscribe === undefined) {
              setWsSubscribe(ws);
              ws.send(stringify(wsMessage));
            }
            break;
          default:
            break;
        }
      }
    };

  useEffect(() => {
    if (wsSubscribe) {
      const data = stringify(wsMessage);
      wsSubscribe.send(data);
    }
  }, [wsMessage]);

  useEffect(() => {
    if (tickerObj) {
      const next = produce(drawTicker, (draft) => {
        const isExist = draft.findIndex(
          (item) => item.coinType === tickerObj.c
        );
        if (tickerObj.c === 'C0101') {
          console.log(tickerObj);
        }
        // console;
        if (isExist === -1) {
          console.log('없는게 들어왔다고? ');
          // draft.push(tickerObj);
        } else {
          draft[isExist] = { ...draft[isExist], ...tickerObj };
        }
      });

      setDrawTicker(next);

      // const next = produce(ticker, (draft) => {
      //   if (draft.length === 0) {
      //     draft.push(tickerObj);
      //     return;
      //   }
      //   const isExist = draft.findIndex((item) => item.c === tickerObj.c);
      //   if (isExist === -1) {
      //     draft.push(tickerObj);
      //   } else {
      //     draft[isExist] = tickerObj;
      //   }
      // });
      // setTicker(next);
    }
  }, [tickerObj]);

  useEffect(() => {
    console.log(ticker);
  }, [ticker]);

  /** 유저아톰이 가지고있는 소켓 배열에 추가해준다. */

  useEffect(() => {
    try {
      switch (type) {
        case 'SUBSCRIBE':
          const subWs = new WebSocket('wss://wss1.bithumb.com/public');
          subWs.onopen = generateOnOpen(type, subWs);
          subWs.onerror = generateOnError(type);
          subWs.onclose = generateOnCloser(type);
          subWs.onmessage = generateOnMessage(type);
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
