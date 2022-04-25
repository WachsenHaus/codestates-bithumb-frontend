import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { selectorCoinBar, atomDrawCoinBar } from '../atom/coinBar.atom';

export const useGetCoinBar = () => {
  const coinBar = useRecoilValue(selectorCoinBar);
  const [drawCoinBar, setDrawCoinBar] = useRecoilState(atomDrawCoinBar);

  useEffect(() => {
    setDrawCoinBar(coinBar);
  }, [coinBar]);

  return { ...drawCoinBar };
};

export default useGetCoinBar;
