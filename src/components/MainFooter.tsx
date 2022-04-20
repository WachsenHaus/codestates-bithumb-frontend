/* eslint-disable @typescript-eslint/no-redeclare */
import React, { useEffect, useRef, useState } from 'react';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import produce from 'immer';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import styles from './animation.module.css';
import classNames from 'classnames';
import { Box } from 'grommet';
import { atomDrawTicker, TypeDrawTicker } from '../atom/drawData.atom';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarRateIcon from '@mui/icons-material/StarRate';

import { Column, createTableMultiSort, SortDirection, Table } from 'react-virtualized';
import { Autocomplete, Button, Input, Paper, TextField } from '@mui/material';
import { atomSelectCoin } from '../atom/selectCoin.atom';
import { atomCoinList } from '../atom/coinList.atom';
import { createMultiSort, SortIndicator, TableHeaderProps, TableHeaderRenderer } from 'react-virtualized/dist/es/Table';

import _ from 'lodash';
import { getCookie, setCookie } from '../hooks/useGetCoinList';
import { Item } from 'framer-motion/types/components/Reorder/Item';
import useGetSortTicker from '../hooks/useGetSortTicker';

type ButtonTypes = 'KRW' | 'BTC' | 'FAVOURITE';

/**
 *
 * @returns 티커가 그려지는 메인 바텀 푸터입니다.
 */
const MainFooter = () => {
  const [selectCoin, setSelectCoin] = useRecoilState(atomSelectCoin);

  //
  const [drawTicker, setDrawTicker] = useRecoilState(atomDrawTicker);

  const [sortFn, sortList, viewMode, setViewMode, keywordRef] = useGetSortTicker();

  const onClick = (data: any) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (data.coinType === selectCoin.coinSymbol) {
      return;
    }
    console.log(data);
    setSelectCoin((prevData) => {
      return {
        ...prevData,
        coinType: data.coinType,
        coinSymbol: data.coinSymbol,
        e: data.e,
        v24: data.v24,
        u24: data.u24,
        h: data.h,
        l: data.l,
        f: data.f,
      };
    });
  };
  const sortState = createMultiSort(sortFn);

  return (
    <div>
      <div>
        <Box direction="row" background={'light-5'} width="100%" className={classNames('flex flex-row justify-start items-center')}>
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

          <TextField
            onChange={(e) => {
              keywordRef.current = e.target.value;
            }}
          />
        </Box>
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
                rowClassName={classNames(`flex`)}
                rowGetter={({ index }) => {
                  return sortList[index];
                }}
              >
                <Column
                  width={width * 0.05}
                  label=""
                  dataKey="isFavorite"
                  cellRenderer={(e) => {
                    return (
                      <div
                        onClick={() => {
                          const list = getCookie('marketFavoritesCoin');
                          const parseList = list.replace('[', '').replace(']', '').replace(/\"/g, '').split(',');
                          const coin = `${e.rowData.coinType}_${e.rowData.m}`;
                          const isIndex = parseList.findIndex((item) => item === coin);
                          if (isIndex !== -1) {
                            parseList.splice(isIndex, 1);
                          } else {
                            const coin = `"${e.rowData.coinType}_${e.rowData.m}"`;
                            parseList.push(coin);
                          }
                          const cookieValue = `[${parseList}]`;
                          setCookie('marketFavoritesCoin', cookieValue, 1);
                          const next = produce(drawTicker, (item) => {
                            const a = item.find((item) => item.coinSymbol === e.rowData.coinSymbol);
                            if (a) {
                              a.isFavorite = !a.isFavorite;
                            }
                          });
                          setDrawTicker(next);
                        }}
                      >
                        {e.rowData.isFavorite ? <StarRateIcon /> : <StarBorderIcon />}
                      </div>
                    );
                  }}
                />
                <Column
                  width={width * 0.2}
                  label="자산"
                  dataKey="coinName"
                  cellRenderer={(e) => {
                    return (
                      <div onClick={onClick(e.rowData)}>
                        {e.cellData}
                        <div>
                          {e.rowData.coinSymbol}/{e.rowData.m === 'C0100' ? 'KRW' : ''}
                        </div>
                      </div>
                    );
                  }}
                />
                <Column
                  width={width * 0.4}
                  label="현재가"
                  dataKey="e"
                  // headerRenderer={HeaderRenderer}
                />
                <Column
                  width={width * 0.15}
                  label="변동률(당일)"
                  dataKey="r"
                  cellRenderer={(e) => {
                    return (
                      <div>
                        {e.cellData}
                        <div>{e.rowData.a}</div>
                      </div>
                    );
                  }}
                />
                <Column width={width * 0.1} label="거래금액(24H)" dataKey="u24" />
              </Table>
            )}
          </AutoSizer>
        </Paper>
      </div>
    </div>
  );
};
export default MainFooter;
