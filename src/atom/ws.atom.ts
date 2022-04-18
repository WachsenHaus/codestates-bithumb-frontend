import { atom } from 'recoil';
import {
  IWebSocketSubscribeMessage,
  TypeWebSocketTickerReturnType,
} from './ws.type';

export const atomSubscribeWebSocket = atom<WebSocket | undefined>({
  key: 'atomWebSocket',
  default: undefined,
});

export const atomSubscribeWebSocektMessage = atom<
  IWebSocketSubscribeMessage | undefined
>({
  key: 'atomSubscribeWebSocektMessage',
  default: {
    events: [
      {
        type: 'tr',
        filters: ['C0100', 'C0101'],
      },
      {
        type: 'tk',
        filters: ['MID'],
      },
      {
        type: 'st',
        filters: ['C0100', 'C0101'],
      },
    ],

    type: 'SUBSCRIBE',
  },
});

/**
 * 티커 배열에 티커들이 온다면 오브젝트로 저장하고,
 * 해당 코인이름이 있다면 그 코인을 찾아서 애니메이션을주자,
 * 없다면 티커 배열에 추가,
 */
export const atomTicker = atom<Array<TypeWebSocketTickerReturnType>>({
  key: 'atomTicker',
  default: [],
});
