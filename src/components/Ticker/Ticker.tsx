/* eslint-disable @typescript-eslint/no-redeclare */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import classNames from 'classnames';
import { Column, IndexRange, OverscanIndexRange, Table } from 'react-virtualized';
import { InputAdornment, Pagination, Paper, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import _ from 'lodash';
import {
  HeaderCoinName,
  HeaderVolume,
  HeaderPrice,
  HeaderRateOfChange,
  RenderCurrentPriceColumn,
  RenderFavoriteColumn,
  RenderNameColumn,
  RenderRateOfChange,
  RenderU24,
} from './../Ticker/TickerBody';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  atomFilterDirection,
  atomFilteredCoins,
  atomFilterKeyword,
  atomFilterMode,
  atomFilterOrderBy,
  atomFinalCoins,
  atomPriceInfoUseCoins,
} from '../../atom/total.atom';

const Ticker = () => {
  const [orderMode, setOrderMode] = useRecoilState(atomFilterOrderBy);
  const [sortDirection, setSortDirection] = useRecoilState(atomFilterDirection);

  const [filterMode, setFilterMode] = useRecoilState(atomFilterMode);
  const filterKeyword = useRecoilValue(atomFilterKeyword);
  const setFilterKeyword = useSetRecoilState(atomFilterKeyword);
  const filterdCoins = useRecoilValue(atomFilteredCoins);
  // const priceInfoUseCoins = useRecoilValue(atomPriceInfoUseCoins);

  const delayKeyword = useRef(_.debounce((word) => debounceKeyword(word), 300)).current;

  // 초ㅣ적화

  const debounceKeyword = (word: any) => {
    setFilterKeyword(word);
  };

  const rowHeight = 50;
  const headerHeight = 50;
  const rowCount = filterdCoins?.length;

  const [height, setHeight] = useState(350);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(height / rowHeight);
  const pageCount = Math.ceil(rowCount / perPage);
  const [scrollToIndex, setScrollToIndex] = useState<undefined | number>(undefined);

  const handleRowsScroll = useCallback((info: IndexRange & OverscanIndexRange) => {
    setPage((prev) => {
      return Math.ceil(info.stopIndex / perPage);
    });
    setScrollToIndex(undefined);
  }, []);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
    setScrollToIndex((prev) => {
      const scrollToIndex = (page - 1) * perPage;
      return scrollToIndex;
    });
  }, []);

  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const keyword = e.target.value as string;
    delayKeyword(keyword);
  }, []);

  const onClick = useCallback(
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

  return (
    <div>
      <div>
        <div
          className={classNames('grid', `grid-cols-2 grid-rows-1`)}
          style={{
            gridTemplateColumns: '40% auto',
          }}
        >
          <div className={classNames(`w-full h-full`, `flex items-center justify-around`)}>
            <button
              className={classNames(filterMode === 'normal' && `border-b-4 font-bold`, `border-b-black`, `h-full`)}
              onClick={(e) => {
                setFilterMode('normal');
              }}
            >
              원화마켓
            </button>
            <button
              className={classNames(filterMode === 'isFavorite' && `border-b-4 font-bold `, `border-b-black`, `h-full`)}
              onClick={(e) => {
                setFilterMode('isFavorite');
              }}
            >
              즐겨찾기
            </button>
          </div>

          <TextField
            placeholder="검색"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={onChange}
          />
        </div>
      </div>

      <div>
        <Paper
          sx={{
            height: height,
            width: '100%',
          }}
        >
          <AutoSizer>
            {({ width, height }) =>
              filterdCoins?.length > 0 ? (
                <Table
                  width={width}
                  height={height}
                  headerHeight={headerHeight}
                  rowHeight={rowHeight}
                  rowCount={rowCount}
                  scrollToIndex={scrollToIndex}
                  onRowsRendered={handleRowsScroll}
                  scrollToAlignment="start"
                  rowClassName={classNames(`flex border-b `)}
                  rowGetter={({ index }) => {
                    return filterdCoins[index];
                  }}
                >
                  <Column width={width * 0.05} label="" dataKey="isFavorite" cellRenderer={(e) => <RenderFavoriteColumn {...e} />} />
                  <Column
                    width={width * 0.2}
                    label="자산"
                    dataKey="coinName"
                    cellRenderer={(e) => <RenderNameColumn {...e} />}
                    headerRenderer={(e) => <HeaderCoinName {...e} />}
                    headerClassName="flex items-center"
                  />
                  <Column
                    width={width * 0.2}
                    label="현재가"
                    dataKey="e"
                    className="flex"
                    cellRenderer={(e) => <RenderCurrentPriceColumn {...e} />}
                    headerRenderer={(e) => <HeaderPrice e={e} direction={sortDirection} arrowActive={orderMode === 'e'} onClick={onClick('e')} />}
                    headerClassName="flex items-center"
                  />
                  <Column
                    width={width * 0.15}
                    label="변동률(당일)"
                    dataKey="r"
                    cellRenderer={(e) => <RenderRateOfChange {...e} />}
                    headerRenderer={(e) => <HeaderRateOfChange e={e} direction={sortDirection} arrowActive={orderMode === 'r'} onClick={onClick('r')} />}
                    headerClassName="flex items-center"
                  />
                  <Column
                    width={width * 0.2}
                    label="거래금액(24H)"
                    dataKey="u24"
                    cellRenderer={(e) => <RenderU24 {...e} />}
                    headerRenderer={(e) => <HeaderVolume e={e} direction={sortDirection} arrowActive={orderMode === 'u24'} onClick={onClick('u24')} />}
                    headerClassName="flex items-center"
                  />
                </Table>
              ) : (
                <div
                  style={{
                    width,
                    height,
                  }}
                  className={'flex justify-center items-center font-bmjua'}
                >
                  '{filterKeyword}'로 검색된 가상자산이 없습니다.
                </div>
              )
            }
          </AutoSizer>
        </Paper>
      </div>
      <div className="flex items-center w-full ">
        <Pagination count={pageCount} page={page} onChange={handlePageChange} className="mx-auto mt-2" />
      </div>
    </div>
  );
};
export default Ticker;
