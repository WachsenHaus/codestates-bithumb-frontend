import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { atomDrawTicker, TypeDrawTicker } from '../atom/drawData.atom';
import _ from 'lodash';
import { atomFinalCoins } from '../atom/total.atom';

export const order = (
  orderMode: 'e' | 'r' | 'u24',
  datas: TypeDrawTicker[],
  sortDirection: 'asc' | 'desc'
) => {
  if (orderMode === 'e') {
    return _.orderBy(datas, [(e) => Number(e.e)], [sortDirection]);
  } else if (orderMode === 'r') {
    return _.orderBy(datas, [(e) => Number(e.r)], [sortDirection]);
  } else {
    return _.orderBy(datas, [(e) => Number(e.u24)], [sortDirection]);
  }
};

const useGetSortTicker = (
  sortBy: Array<'isFavorit' | 'coinName' | 'e' | 'r' | 'u24'>,
  sortDirection: 'asc' | 'desc'
) => {
  const drawTicker = useRecoilValue(atomFinalCoins);
  const [isSorting, setIsSorting] = useState(false);
  const [sortList, setSortList] = useState<TypeDrawTicker[]>(drawTicker);

  const sort = ({
    sortBy = 'e',
    sortDirection = 'desc',
  }: {
    sortBy: any;
    sortDirection: any;
  }) => {
    return drawTicker;
  };

  useEffect(() => {
    sort({
      sortBy,
      sortDirection,
    });
  }, [sortBy, sortDirection]);

  return [sort, sortList] as const;
};

export default useGetSortTicker;
