/* eslint-disable @typescript-eslint/no-redeclare */
import React, { useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import classNames from 'classnames';
import { Column, Table } from 'react-virtualized';
import {
  Autocomplete,
  Button,
  InputAdornment,
  Paper,
  TextField,
} from '@mui/material';
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
import useGetSortTicker from '../../hooks/useGetSortTicker';

const Ticker = () => {
  const [viewMode, setViewMode] = useState<'normal' | 'favorite'>('normal');
  const [orderMode, setOrderMode] = useState<'e' | 'r' | 'u24'>('u24');
  const [sortBy, setSortBy] = useState<
    Array<'isFavorit' | 'coinName' | 'e' | 'r' | 'u24'>
  >([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [sortFn, sortList, keywordRef] = useGetSortTicker(
    viewMode,
    orderMode,
    sortBy,
    sortDirection
  );

  const [isExist, setIsExist] = useState(false);
  useEffect(() => {
    if (sortList?.length > 0) {
      setIsExist(true);
    } else {
      setIsExist(false);
    }
  }, [sortList]);

  const onClick = (type: 'e' | 'r' | 'u24') => () => {
    let direction: 'desc' | 'asc' = 'desc';
    if (orderMode === type) {
      direction = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      direction = 'desc';
    }

    setOrderMode(type);
    setSortBy([type]);
    setSortDirection(direction);
  };

  return (
    <div>
      <div>
        <div
          className={classNames('grid', `grid-cols-2 grid-rows-1`)}
          style={{
            gridTemplateColumns: '40% auto',
          }}
        >
          <div
            className={classNames(
              `w-full h-full`,
              `flex items-center justify-around`
            )}
          >
            <button
              // variant={viewMode === 'normal' ? 'outlined' : undefined}
              className={classNames(
                viewMode === 'normal' && `border-b-4 font-bold`,
                `border-b-black`,
                `h-full`
              )}
              onClick={(e) => {
                setViewMode('normal');
              }}
            >
              원화마켓
            </button>
            <button
              className={classNames(
                viewMode === 'favorite' && `border-b-4 font-bold `,
                `border-b-black`,
                `h-full`
              )}
              onClick={(e) => {
                setViewMode('favorite');
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
            onChange={(e) => {
              keywordRef.current = e.target.value;
            }}
          />
        </div>
      </div>
      <div>
        <Paper
          sx={{
            height: 400,
            width: '100%',
          }}
        >
          <AutoSizer>
            {({ width, height }) =>
              isExist ? (
                <Table
                  sort={sortFn}
                  sortBy={undefined}
                  sortDirection={undefined}
                  width={width}
                  height={height}
                  headerHeight={50}
                  rowHeight={50}
                  rowCount={sortList.length}
                  rowClassName={classNames(`flex border-b `)}
                  rowGetter={({ index }) => {
                    return sortList[index];
                  }}
                >
                  <Column
                    width={width * 0.05}
                    label=""
                    dataKey="isFavorite"
                    cellRenderer={(e) => <RenderFavoriteColumn {...e} />}
                  />
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
                    headerRenderer={(e) => (
                      <HeaderPrice
                        e={e}
                        direction={sortDirection}
                        arrowActive={orderMode === 'e'}
                        onClick={onClick('e')}
                      />
                    )}
                    headerClassName="flex items-center"
                  />
                  <Column
                    width={width * 0.15}
                    label="변동률(당일)"
                    dataKey="r"
                    cellRenderer={(e) => <RenderRateOfChange {...e} />}
                    headerRenderer={(e) => (
                      <HeaderRateOfChange
                        e={e}
                        direction={sortDirection}
                        arrowActive={orderMode === 'r'}
                        onClick={onClick('r')}
                      />
                    )}
                    headerClassName="flex items-center"
                  />
                  <Column
                    width={width * 0.2}
                    label="거래금액(24H)"
                    dataKey="u24"
                    cellRenderer={(e) => <RenderU24 {...e} />}
                    headerRenderer={(e) => (
                      <HeaderVolume
                        e={e}
                        direction={sortDirection}
                        arrowActive={orderMode === 'u24'}
                        onClick={onClick('u24')}
                      />
                    )}
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
                  '{keywordRef.current}'로 검색된 가상자산이 없습니다.
                </div>
              )
            }
          </AutoSizer>
        </Paper>
      </div>
    </div>
  );
};
export default Ticker;
