import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { atomDrawTicker, TypeDrawTicker } from '../atom/drawData.atom';
import _ from 'lodash';

const useGetSortTicker = (
  viewMode: 'normal' | 'favorite' | 'e' | 'r' | 'u24',
  orderMode: 'e' | 'r' | 'u24',
  sortBy: Array<'isFavorit' | 'coinName' | 'e' | 'r' | 'u24'>,
  sortDirection: 'asc' | 'desc'
) => {
  const drawTicker = useRecoilValue(atomDrawTicker);
  const [sortList, setSortList] = useState<Array<TypeDrawTicker>>([]);
  const keywordRef = useRef('');

  const sort = async ({
    sortBy,
    sortDirection,
  }: {
    sortBy: any;
    sortDirection: any;
  }) => {
    if (viewMode === 'normal') {
      let normals;
      if (keywordRef.current === '') {
        normals = drawTicker;
      } else {
        normals = _.filter(
          drawTicker,
          (i) => i.consonant?.toLowerCase().indexOf(keywordRef.current) !== -1
        );
      }
      if (orderMode === 'e') {
        return _.orderBy(normals, [(e) => Number(e.e)], [sortDirection]);
      } else if (orderMode === 'r') {
        return _.orderBy(normals, [(e) => Number(e.r)], [sortDirection]);
      } else {
        return _.orderBy(normals, [(e) => Number(e.u24)], [sortDirection]);
      }
    } else {
      let favorites;
      if (keywordRef.current === '') {
        favorites = _.filter(drawTicker, (i) => i.isFavorite === true);
      } else {
        favorites = _.filter(
          drawTicker,
          (i) =>
            i.isFavorite === true &&
            i.consonant?.toLowerCase().indexOf(keywordRef.current) !== -1
        );
      }
      if (orderMode === 'e') {
        return _.orderBy(favorites, [(e) => Number(e.e)], [sortDirection]);
      } else if (orderMode === 'r') {
        return _.orderBy(favorites, [(e) => Number(e.r)], [sortDirection]);
      } else {
        return _.orderBy(favorites, [(e) => Number(e.u24)], [sortDirection]);
      }
    }
  };

  const getSort = async () => {
    sort({
      sortBy,
      sortDirection,
    }).then((result) => {
      setSortList(result);
    });
  };
  useEffect(() => {
    getSort();
  }, [drawTicker]);

  return [sort, sortList, keywordRef] as const;
};

export default useGetSortTicker;
