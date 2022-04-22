import { atom } from 'recoil';

export interface ICommonConfig {
  isInit: boolean;
}

export const atomCommonConfig = atom<ICommonConfig>({
  key: 'AtomCommonConfig',
  default: {
    isInit: false,
  },
});
