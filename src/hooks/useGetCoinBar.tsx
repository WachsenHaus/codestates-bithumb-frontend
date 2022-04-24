import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { atomCoinBar, atomDrawCoinBar } from '../atom/coinBar.atom';

export const useGetCoinBar = () => {
  const result = useRecoilValue(atomDrawCoinBar);
  const setDrawCoinBar = useSetRecoilState(atomDrawCoinBar);
  const coinBar = useRecoilValue(atomCoinBar);

  useEffect(() => {
    setDrawCoinBar(coinBar);
  }, [coinBar]);

  return { ...result };
};

export default useGetCoinBar;
