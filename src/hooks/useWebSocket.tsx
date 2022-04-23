import stringify from 'fast-json-stable-stringify';
import parse from 'fast-json-parse';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import produce from 'immer';

import {
  atomSubscribeWebSocektMessage,
  atomSubscribeWebSocket,
  atomTicker,
} from '../atom/ws.atom';
import {
  TypeWebSocketSubscribeReturnType,
  TypeWebSocketTickerReturnType,
  TypeWebSocketTypes,
} from '../atom/ws.type';
import {
  atomDrawCoinInfo,
  atomDrawTicker,
  atomDrawTransaction,
  TypeDrawTicker,
} from '../atom/drawData.atom';
import { atomGetStChartData } from '../atom/tvChart.atom';
import { atomSelectCoin } from '../atom/selectCoin.atom';
import { TypeCoinKind } from '../atom/coinList.type';
import { atomCommonConfig } from '../atom/commonConfig.atom';
import { atomTickers } from '../atom/total.atom';

/**
 *
 * @returns 빗썸 웹소켓과 연결하고 웹소켓 객체를 반환합니다.
 */
export const useGenerateBitThumbSocket = (type: TypeWebSocketTypes) => {
  const [wsSubscribe, setWsSubscribe] = useRecoilState(atomSubscribeWebSocket);
  const [wsMessage, setWsMessage] = useRecoilState(
    atomSubscribeWebSocektMessage
  );

  const selectCoin = useRecoilValue(atomSelectCoin);
  const [drawTransaction, setDrawTransaction] =
    useRecoilState(atomDrawTransaction);
  const [tickers, setTickers] = useRecoilState(atomTickers);
  const [stObj, setStObj] = useRecoilState(atomGetStChartData);
  const [transactionObj, setTransactionObj] = useState<{
    m: TypeCoinKind;
    c: string;
    l: {
      o: string;
      n: string;
      p: string;
      q: string;
      t: string;
    }[];
  }>();

  const generateOnError: any | null =
    (type: TypeWebSocketTypes) => (ev: Event) => {
      console.error(`Error WebSocket ${type} ${ev}`);
      console.error(ev);
    };
  const generateOnCloser: any | null =
    (type: TypeWebSocketTypes) => (ev: CloseEvent) => {
      console.info(`Close WebSocket ${type} ${ev}`);
      console.info(ev);
    };

  const generateOnMessage: any | null =
    (nameType: TypeWebSocketTypes) =>
    (ev: MessageEvent<TypeWebSocketSubscribeReturnType>) => {
      if (ev) {
        const { subtype, type, content }: TypeWebSocketSubscribeReturnType =
          parse(ev.data).value;
        switch (nameType) {
          case 'SUBSCRIBE':
            if (type === 'data') {
              if (subtype === 'tk') {
                setTickers(content);
                // setTickerObj(content);
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
    (type: TypeWebSocketTypes, ws: WebSocket) => (ev: Event) => {
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

  /**
   * 웹소켓의 구독 메세지가 변경되면 소켓에 전달합니다.
   */
  useEffect(() => {
    if (wsSubscribe && wsMessage?.events) {
      const message = _.cloneDeep(wsMessage);
      const filter = [selectCoin.siseCrncCd, selectCoin.coinType];
      message?.events.forEach((item) => {
        if (item.type === 'tr') {
          item.filters = filter;
        } else if (item.type === 'st') {
          item.filters = filter;
        }
      });
      const data = stringify(message);
      wsSubscribe.send(data);
    }
  }, [selectCoin]);

  useEffect(() => {
    (async () => {
      const result = await produce(drawTransaction, (draft) => {
        if (transactionObj === undefined) {
          return;
        }
        const { m, c, l } = transactionObj;
        for (let i = 0; i < l.length; i++) {
          const { o, n, p, q, t } = transactionObj.l[i];
          let color = '1';
          let prevPrice;
          const lastItem = draft[draft.length - 1];
          if (lastItem) {
            prevPrice = lastItem.contPrice;
            if (p === prevPrice) {
              color = lastItem.buySellGb;
            } else if (p > prevPrice) {
              color = '2';
            } else {
              color = '1';
            }
          }

          //코인바에 나타날 가격을 갱신함
          // setDrawCoin((prevData) => {
          //   return {
          //     ...prevData,
          //     e: p,
          //     // q:lastItem.
          //   };
          // });

          draft.push({
            coinType: c, //
            contAmt: n, //
            crncCd: m, //
            buySellGb: color,
            contPrice: p, //현재가
            contQty: q, // 수량
            contDtm: t, //
          });

          // 트랜잭션은 20개의 데이터만 보관함.
          if (draft.length > 20) {
            draft.shift();
          }
        }
      });
      setDrawTransaction(result);
    })();
  }, [transactionObj]);

  /**
   * 웹소켓을 생성합니다.
   */
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
