/* eslint-disable @typescript-eslint/no-redeclare */
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import classNames from 'classnames';
import { atomDrawTicker, TypeDrawTicker } from '../atom/drawData.atom';
import { Column, Table } from 'react-virtualized';
import { Autocomplete, Button, Input, Paper, TextField } from '@mui/material';
import { atomSelectCoin } from '../atom/selectCoin.atom';
import { createMultiSort } from 'react-virtualized/dist/es/Table';

import _ from 'lodash';
import {
  HeaderTest,
  RenderCurrentPriceColumn,
  RenderFavoriteColumn,
  RenderNameColumn,
  RenderRateOfChange,
} from './Ticker/TickerBody';

type ButtonTypes = 'KRW' | 'BTC' | 'FAVOURITE';

/**
 *
 * @returns 티커가 그려지는 메인 바텀 푸터입니다.
 */
const MainFooter = () => {
  const [drawTicker, setDrawTicker] = useRecoilState(atomDrawTicker);

  const [sortBy, setSortBy] = useState<Array<'coinName' | 'isFavorite'>>([
    'coinName',
    'isFavorite',
  ]);
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');
  const [viewMode, setViewMode] = useState<'normal' | 'favorite'>('normal');
  const [sortList, setSortList] = useState<Array<TypeDrawTicker>>([]);
  const keywordRef = useRef('');

  useEffect(() => {
    (async () => {
      const r = await sortFn({
        sortBy,
        sortDirection,
        // keyword,
      });
      setSortList(r);
    })();
  }, [drawTicker]);

  useEffect(() => {
    (async () => {
      if (viewMode === 'favorite') {
        setSortBy(['isFavorite']);
        const r = await sortFn({
          sortBy: ['isFavorite'],
          sortDirection,
        });
        setSortList(r);
      } else {
        setSortBy(['coinName']);
        const r = await sortFn({
          sortBy: ['coinName'],
          sortDirection,
        });
        setSortList(r);
      }
    })();
  }, [viewMode]);
  /**
   *
   * @param param0
   * @returns
   */
  const sortFn = async ({
    sortBy,
    sortDirection,
  }: {
    sortBy: any;
    sortDirection: any;
  }) => {
    // draw하는부분에다가 속성으로 검색용 키워드를 집어넣어야겠네,
    if (viewMode === 'normal' && keywordRef.current === '') {
      return drawTicker;
    }
    if (viewMode === 'normal') {
      return _.filter(
        drawTicker,
        (i) => i.consonant?.toLowerCase().indexOf(keywordRef.current) !== -1
      );
    } else {
      if (keywordRef.current === '') {
        return _.filter(drawTicker, (i) => i.isFavorite === true);
      } else {
        return _.filter(
          drawTicker,
          (i) =>
            i.isFavorite === true &&
            i.consonant?.toLowerCase().indexOf(keywordRef.current) !== -1
        );
      }
    }
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
            className={classNames(`w-full`, `flex items-center justify-around`)}
          >
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
                />
                <Column
                  width={width * 0.2}
                  label="현재가"
                  dataKey="e"
                  className="flex"
                  cellRenderer={(e) => <RenderCurrentPriceColumn {...e} />}
                />
                <Column
                  width={width * 0.15}
                  label="변동률(당일)"
                  dataKey="r"
                  headerRenderer={(e) => <HeaderTest {...e} />}
                  headerClassName="flex items-center"
                  cellRenderer={(e) => <RenderRateOfChange {...e} />}
                />
                <Column
                  width={width * 0.1}
                  label="거래금액(24H)"
                  dataKey="u24"
                />
              </Table>
            )}
          </AutoSizer>
        </Paper>
      </div>
    </div>
  );
};
export default MainFooter;
