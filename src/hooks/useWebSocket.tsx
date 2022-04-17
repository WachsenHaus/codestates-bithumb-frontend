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
import {
  atomDrawCoinInfo,
  atomDrawTicker,
  atomDrawTransaction,
  TypeDrawTicker,
} from '../atom/drawData.atom';
import { atomGetStChartData } from '../atom/tvChart.atom';
import { atomSelectCoin } from '../atom/selectCoin.atom';
import { TypeCoinKind } from '../atom/coinList.type';

/**
 *
 * @returns 빗썸 웹소켓과 연결하고 웹소켓 객체를 반환합니다.
 */
export const useGenerateBitThumbSocket = (type: SocketNamesType) => {
  const [wsSubscribe, setWsSubscribe] = useRecoilState(atomSubscribeWebSocket);
  const [wsMessage, setWsMessage] = useRecoilState(
    atomSubscribeWebSocektMessage
  );

  const [drawTicker, setDrawTicker] = useRecoilState(atomDrawTicker);
  const [drawCoin, setDrawCoin] = useRecoilState(atomDrawCoinInfo);
  const selectCoin = useRecoilValue(atomSelectCoin);
  const [drawTransaction, setDrawTransaction] =
    useRecoilState(atomDrawTransaction);
  const [tickerObj, setTickerObj] = useState<TypeWebSocketTickerReturnType>();
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

  /**
   * 웹소켓으로 들어오는 티커 정보를 drawTicker에 갱신합니다.
   * 함수 자리를 이동해야함.
   */
  useEffect(() => {
    if (tickerObj && drawTicker) {
      const result = new Promise<TypeDrawTicker[]>((resolve, reject) => {
        const next = produce(drawTicker, (draft) => {
          const isExist = draft.findIndex((item) => {
            return item.coinType === tickerObj.c;
          });
          // 현재 코인과 선택된 코인의 정보가 같다면 티커에서 들어오는 정보를 drawcoin에도 넣어줌.
          if (tickerObj.c === drawCoin.coinType) {
            setDrawCoin((prevData) => {
              return {
                ...prevData,
                e: tickerObj.e,
                u24: tickerObj.u24,
                v24: tickerObj.v24,
                h: tickerObj.h,
                l: tickerObj.l,
                f: tickerObj.f,
              };
            });
          }
          if (isExist === -1) {
            console.log('not coin');
          } else {
            draft[isExist] = { ...draft[isExist], ...tickerObj };
          }
        });
        if (next) {
          resolve(next);
        } else {
          reject('err');
        }
      });

      result
        .then((d) => {
          setDrawTicker(d);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [tickerObj]);

  useEffect(() => {
    const next = produce(drawTransaction, (draft) => {
      if (transactionObj === undefined) return;
      const { m, c, l } = transactionObj;
      for (let i = 0; i < l.length; i++) {
        const { o, n, p, q, t } = transactionObj.l[i];
        let color = '1';
        let prevPrice;
        if (draft[draft.length - 1]) {
          prevPrice = draft[draft.length - 1].contPrice;
          if (p === prevPrice) {
            color = draft[draft.length - 1].buySellGb;
          } else if (p > prevPrice) {
            color = '2';
          } else {
            color = '1';
          }
        }

        draft.push({
          coinType: c,
          contAmt: n,
          crncCd: m,
          buySellGb: color,
          contPrice: p,
          contQty: q,
          contDtm: t,
        });
        if (draft.length > 10) {
          draft.shift();
        }
      }
    });
    setDrawTransaction(next);
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
