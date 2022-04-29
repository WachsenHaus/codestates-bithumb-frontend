/* eslint-disable @typescript-eslint/no-redeclare */
import React, { useCallback, useMemo } from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import classNames from 'classnames';
import { Column, Table, TableRowProps } from 'react-virtualized';
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
import { useRecoilValue } from 'recoil';
import { atomFilteredCoins } from '../../atom/total.atom';
import useFilterKeyword from '../../hooks/useFilterKeyword';
import useSort from '../../hooks/useSort';
import useGetPagination from '../../hooks/useGetPagination';

const Ticker = () => {
  const [filterKeyword, onChange] = useFilterKeyword();
  const sortObj = useSort();
  const paginationObj = useGetPagination();

  const filterdCoins = useRecoilValue(atomFilteredCoins);

  const rowGetter = ({ index }: { index: number }) => filterdCoins[index];

  const onRender = useCallback(rowGetter, [filterdCoins]);

  const RowRenderer = (e: TableRowProps) => {
    return (
      <div className="flex border-b" key={e.key} style={e.style}>
        {e?.rowData && (
          <>
            <RenderFavoriteColumn {...e} />
            <RenderNameColumn e={e} key={e.rowData.coinName} />
            <RenderCurrentPriceColumn {...e} key={`${e.rowData.e}_${e.rowData.u24}`} />
            <RenderRateOfChange {...e} key={e.rowData.r} />
            <RenderU24 {...e} key={e.rowData.u24} />
          </>
        )}
      </div>
    );
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
          <div className={classNames(`w-full h-full`, `flex items-center justify-around`)}>
            <button
              className={classNames(sortObj.filterMode === 'normal' && `border-b-4 font-bold`, `border-b-black`, `h-full`)}
              onClick={sortObj.onSetFilterMode('normal')}
            >
              원화마켓
            </button>
            <button
              className={classNames(sortObj.filterMode === 'isFavorite' && `border-b-4 font-bold `, `border-b-black`, `h-full`)}
              onClick={sortObj.onSetFilterMode('isFavorite')}
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
            height: paginationObj.height,
            width: '100%',
          }}
        >
          <AutoSizer>
            {({ width, height }) =>
              filterdCoins?.length > 0 ? (
                <Table
                  width={width}
                  height={height}
                  headerHeight={paginationObj.headerHeight}
                  rowHeight={paginationObj.rowHeight}
                  rowCount={paginationObj.rowCount}
                  scrollToIndex={paginationObj.scrollToIndex}
                  onRowsRendered={paginationObj.handleRowsScroll}
                  scrollToAlignment="start"
                  rowClassName={classNames(`flex border-b `)}
                  rowGetter={onRender}
                  rowRenderer={RowRenderer}
                >
                  <Column width={width * 0.05} label="" dataKey="isFavorite" />
                  <Column
                    width={width * 0.2}
                    label="자산"
                    dataKey="coinName"
                    headerRenderer={(e) => <HeaderCoinName {...e} />}
                    headerClassName="flex items-center"
                  />
                  <Column
                    width={width * 0.2}
                    label="현재가"
                    dataKey="e"
                    className="flex"
                    headerRenderer={(e) => (
                      <HeaderPrice
                        e={e}
                        direction={sortObj.sortDirection}
                        arrowActive={sortObj.orderMode === 'e'}
                        onClick={sortObj.onSetFilterDirection('e')}
                      />
                    )}
                    headerClassName="flex items-center"
                  />
                  <Column
                    width={width * 0.15}
                    label="변동률(당일)"
                    dataKey="r"
                    headerRenderer={(e) => (
                      <HeaderRateOfChange
                        e={e}
                        direction={sortObj.sortDirection}
                        arrowActive={sortObj.orderMode === 'r'}
                        onClick={sortObj.onSetFilterDirection('r')}
                      />
                    )}
                    headerClassName="flex items-center"
                  />
                  <Column
                    width={width * 0.2}
                    label="거래금액(24H)"
                    dataKey="u24"
                    headerRenderer={(e) => (
                      <HeaderVolume
                        e={e}
                        direction={sortObj.sortDirection}
                        arrowActive={sortObj.orderMode === 'u24'}
                        onClick={sortObj.onSetFilterDirection('u24')}
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
                  '{filterKeyword}'로 검색된 가상자산이 없습니다.
                </div>
              )
            }
          </AutoSizer>
        </Paper>
      </div>
      <div className="flex items-center w-full ">
        <Pagination count={paginationObj.pageCount} page={paginationObj.page} onChange={paginationObj.handlePageChange} className="mx-auto mt-2" />
      </div>
    </div>
  );
};
export default React.memo(Ticker);
