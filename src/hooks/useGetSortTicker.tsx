import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { atomDrawTicker, TypeDrawTicker } from '../atom/drawData.atom';
import _ from 'lodash';

const useGetSortTicker = () => {
  const drawTicker = useRecoilValue(atomDrawTicker);
  const [sortList, setSortList] = useState<Array<TypeDrawTicker>>([]);
  const [viewMode, setViewMode] = useState<'normal' | 'favorite'>('normal');
  // const [sortBy, setSortBy] = useState<Array<'coinName' | 'isFavorite'>>(['coinName', 'isFavorite']);
  // const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');

  const keywordRef = useRef('');

  const sort = ({ sortBy, sortDirection = 'DESC' }: { sortBy: any; sortDirection: any }) => {
    if (viewMode === 'normal' && keywordRef.current === '') {
      return drawTicker;
    }
    if (viewMode === 'normal') {
      return _.filter(drawTicker, (i) => i.consonant?.toLowerCase().indexOf(keywordRef.current) !== -1);
    } else {
      if (keywordRef.current === '') {
        return _.filter(drawTicker, (i) => i.isFavorite === true);
      } else {
        return _.filter(drawTicker, (i) => i.isFavorite === true && i.consonant?.toLowerCase().indexOf(keywordRef.current) !== -1);
      }
    }
  };

  useEffect(() => {
    const soryBy = viewMode === 'favorite' ? ['isFavorite'] : ['coinName'];
    const result = sort({
      sortBy: soryBy,
      sortDirection: 'DESC',
    });
    setSortList(result);
  }, [drawTicker, viewMode]);

  return [sort, sortList, viewMode, setViewMode, keywordRef] as const;
};

export default useGetSortTicker;
