import { atom, selector } from 'recoil';
import { atomSelectCoinDefault } from './selectCoinDefault.atom';

export const atomSubscribeWebSocket = atom<WebSocket | undefined>({
  key: 'atomWebSocket',
  default: undefined,
});

export const atomSubscribeWebSocektMessage = selector({
  key: 'atomSubscribeWebSocektMessage',
  get: ({ get }) => {
    const { siseCrncCd, coinType } = get(atomSelectCoinDefault);
    const filter = [siseCrncCd, coinType];
    const result = {
      events: [
        {
          type: 'tr',
          filters: filter,
        },
        {
          type: 'tk',
          filters: ['MID'],
        },
        {
          type: 'st',
          filters: filter,
        },
      ],
      type: 'SUBSCRIBE',
    };
    return result;
  },
});
