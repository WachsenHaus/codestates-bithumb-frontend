/* eslint-disable @typescript-eslint/no-redeclare */
import React from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import classNames from 'classnames';
import { Column, Table } from 'react-virtualized';
import { Autocomplete, Button, Paper, TextField } from '@mui/material';
import _ from 'lodash';
import {
  HeaderTest,
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
  const [sortFn, sortList, viewMode, setViewMode, keywordRef] = useGetSortTicker();

  return (
    <div>
      <div>
        <div
          className={classNames('grid', `grid-cols-2 grid-rows-1`)}
          style={{
            gridTemplateColumns: '40% auto',
          }}
        >
          <div className={classNames(`w-full`, `flex items-center justify-around`)}>
            <Button
              variant={viewMode === 'normal' ? 'outlined' : undefined}
              onClick={(e) => {
                setViewMode('normal');
              }}
            >
              원화 마켓
            </Button>
            <Button
              variant={viewMode === 'favorite' ? 'outlined' : undefined}
              onClick={(e) => {
                setViewMode('favorite');
              }}
            >
              즐겨찾기
            </Button>
          </div>

          <TextField
            placeholder="검색"
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
            {({ width, height }) => (
              <Table
                sort={sortFn}
                sortBy={undefined}
                sortDirection={undefined}
                width={width}
                height={height}
                headerHeight={50}
                rowHeight={50}
                rowCount={sortList.length}
                rowClassName={classNames(`flex border-t-2`)}
                rowGetter={({ index }) => {
                  return sortList[index];
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
                  headerRenderer={(e) => <HeaderPrice {...e} />}
                  headerClassName="flex items-center"
                />
                <Column
                  width={width * 0.15}
                  label="변동률(당일)"
                  dataKey="r"
                  cellRenderer={(e) => <RenderRateOfChange {...e} />}
                  headerRenderer={(e) => <HeaderRateOfChange {...e} />}
                  headerClassName="flex items-center"
                />
                <Column
                  width={width * 0.1}
                  label="거래금액(24H)"
                  dataKey="u24"
                  cellRenderer={(e) => <RenderU24 {...e} />}
                  headerRenderer={(e) => <HeaderVolume {...e} />}
                  headerClassName="flex items-center"
                />
              </Table>
            )}
          </AutoSizer>
        </Paper>
      </div>
    </div>
  );
};
export default Ticker;
