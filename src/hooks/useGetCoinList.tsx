import produce from 'immer';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { API_BITHUMB_STATUS_CODE } from '../api/bt.api';
import { atomCoinList, atomGetCoinList } from '../atom/coinList.atom';

const useGetCoinList = () => {
  const [coinState, setCoinState] = useRecoilState(atomCoinList);
  const queryResults = useRecoilValue(atomGetCoinList);
  useEffect(() => {
    if (queryResults?.status === API_BITHUMB_STATUS_CODE.SUCCESS) {
      console.log(queryResults.data);
      setCoinState(queryResults.data);
    }
  }, [queryResults]);
};

export default useGetCoinList;
