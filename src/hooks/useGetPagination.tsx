import { useState, useCallback, useEffect } from 'react';
import { IndexRange, OverscanIndexRange } from 'react-virtualized';
import { useRecoilValue } from 'recoil';
import { atomFilteredCoins } from '../atom/total.atom';

/**
 *
 * @returns 페이징에 필요한 변수와 함수들을 가져온다.
 */
const useGetPagination = () => {
  const filterdCoins = useRecoilValue(atomFilteredCoins);

  const [height, setHeight] = useState(350);
  const [page, setPage] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(50);
  const [rowHeight, setRowHeight] = useState(50);
  const [rowCount, setRowCount] = useState(filterdCoins?.length);
  // const rowCount = filterdCoins?.length;
  const [perPage, setPerPage] = useState(height / rowHeight);
  const [pageCount, setPageCount] = useState(Math.ceil(rowCount / perPage));
  const [scrollToIndex, setScrollToIndex] = useState<undefined | number>(
    undefined
  );
  // const headerHeight = 50;
  // const rowHeight = 50;
  // const perPage = height / rowHeight;
  // const pageCount = Math.ceil(rowCount / perPage);

  useEffect(() => {
    setRowCount(filterdCoins.length);
  }, [filterdCoins.length]);
  useEffect(() => {
    setPageCount(Math.ceil(rowCount / perPage));
  }, [rowCount]);

  const handleRowsScroll = useCallback(
    (info: IndexRange & OverscanIndexRange) => {
      setPage((prev) => {
        return Math.ceil(info.stopIndex / perPage);
      });
      setScrollToIndex(undefined);
    },
    []
  );

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      setPage(page);
      setScrollToIndex((prev) => {
        const scrollToIndex = (page - 1) * perPage;
        return scrollToIndex;
      });
    },
    []
  );

  return {
    height,
    headerHeight,
    rowHeight,
    rowCount,
    scrollToIndex,
    page,
    pageCount,
    handleRowsScroll,
    handlePageChange,
  } as const;
};

export default useGetPagination;
