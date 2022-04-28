import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import {
  atomFilterOrderBy,
  atomFilterDirection,
  atomFilterMode,
  TypefilterMode,
} from '../atom/total.atom';

/**
 *
 * @returns sort에 필요한 변수와 함수들을 가져온다.
 */
const useSort = () => {
  const [orderMode, setOrderMode] = useRecoilState(atomFilterOrderBy);
  const [sortDirection, setSortDirection] = useRecoilState(atomFilterDirection);
  const [filterMode, setFilterMode] = useRecoilState(atomFilterMode);

  const onSetFilterDirection = useCallback(
    (type: 'e' | 'r' | 'u24') => () => {
      let direction: 'desc' | 'asc' = 'desc';
      if (orderMode === type) {
        direction = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        direction = 'desc';
      }
      setOrderMode(type);
      setSortDirection(direction);
    },
    [orderMode, sortDirection, setOrderMode, setSortDirection]
  );

  const onSetFilterMode = useCallback(
    (mode: TypefilterMode) => () => {
      setFilterMode(mode);
    },
    []
  );

  return {
    orderMode,
    filterMode,
    sortDirection,
    onSetFilterMode,
    onSetFilterDirection,
  } as const;
};

export default useSort;
