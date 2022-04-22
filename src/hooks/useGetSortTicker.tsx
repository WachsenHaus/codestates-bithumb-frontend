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

const useGetSortTicker = (
  viewMode: 'normal' | 'favorite' | 'e' | 'r' | 'u24',
  orderMode: 'e' | 'r' | 'u24',
  sortBy: Array<'isFavorit' | 'coinName' | 'e' | 'r' | 'u24'>,
  sortDirection: 'asc' | 'desc'
) => {
  const drawTicker = useRecoilValue(atomDrawTicker);
  const [sortList, setSortList] = useState<Array<TypeDrawTicker>>([]);
  const keywordRef = useRef('');
  const [isSorting, setIsSorting] = useState(false);
  // const throttled = useRef(
  //   _.throttle((drawTicker, viewMode) => getSort(drawTicker, viewMode), 700)
  // );

  const order = useCallback(
    (
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
    },
    []
  );

  const sort = async ({
    sortBy,
    sortDirection,
  }: {
    sortBy: any;
    sortDirection: any;
  }) => {
    const err = drawTicker.find(
      (item) => item.e === undefined || item.e === ''
    );
    if (err) {
      console.log(err);
    }

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
      return order(orderMode, normals, sortDirection);
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
      return order(orderMode, favorites, sortDirection);
    }
  };

  const getSort = () => {
    // getSort
    // console.log('검색');
    // console.log(viewMode);
    // console.log(keywordRef.current);
    // console.time('calculatingTime');

    sort({
      sortBy,
      sortDirection,
    }).then((result) => {
      // console.timeEnd('calculatingTime');
      setSortList(result);
      setIsSorting(false);
    });
  };

  useEffect(() => {
    // setIsSorting(true);
    // getSort();
    if (isSorting === false) {
      setIsSorting(true);
      getSort();
    } else {
      console.log('block sorting');
    }
  }, [drawTicker, viewMode, keywordRef.current, orderMode, sortDirection]);

  return [sort, sortList, keywordRef] as const;
};

export default useGetSortTicker;
