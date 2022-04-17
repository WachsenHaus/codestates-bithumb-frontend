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

import {
  Column,
  createTableMultiSort,
  SortDirection,
  Table,
} from 'react-virtualized';
import { Autocomplete, Button, Input, Paper, TextField } from '@mui/material';
import { atomSelectCoin } from '../atom/selectCoin.atom';
import { atomCoinList } from '../atom/coinList.atom';
import {
  createMultiSort,
  SortIndicator,
  TableHeaderProps,
  TableHeaderRenderer,
} from 'react-virtualized/dist/es/Table';

import _ from 'lodash';
import { getCookie, setCookie } from '../hooks/useGetCoinList';
import { Item } from 'framer-motion/types/components/Reorder/Item';

type ButtonTypes = 'KRW' | 'BTC' | 'FAVOURITE';

/**
 *
 * @returns 티커가 그려지는 메인 바텀 푸터입니다.
 */
const MainFooter = () => {
  const [drawTicker, setDrawTicker] = useRecoilState(atomDrawTicker);
  const [selectCoin, setSelectCoin] = useRecoilState(atomSelectCoin);
  const [sortBy, setSortBy] = useState<Array<'coinName' | 'isFavorite'>>([
    'coinName',
    'isFavorite',
  ]);
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');

  const [viewMode, setViewMode] = useState<'normal' | 'favorite'>('normal');

  const [sortList, setSortList] = useState<Array<TypeDrawTicker>>([]);

  const keywordRef = useRef('');
  const [flag, setFlag] = useState(false);

  // const coinList = useRecoilValue(atomCoinList);
  /**
   * 해당 버튼을 클릭할 경우 type에 따라 웹소켓의 통신방식이 변경되어야겠네요
   */

  /* <Table>
            <TableHeader>
              <TableRow>
                <TableCell scope="col" border="bottom">
                  자산
                </TableCell>
                <TableCell scope="col" border="bottom">
                  실시간 시세(KRW)
                </TableCell>
                <TableCell scope="col" border="bottom">
                  변동률(%)
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drawTicker.map((item) => {
                const upOrDown = item.r !== undefined ? parseFloat(item.r) : 0;
                const cost =
                  item.e !== undefined
                    ? Number(item.e).toLocaleString('ko-kr')
                    : null;
                return (
                  <>
                    {item.coinClassCode !== 'F' && (
                      <TableRow key={item.e}>
                        <TableCell scope="row">
                          <strong>{item?.coinName}</strong>
                        </TableCell>
                        <TableCell scope="row">
                          {cost !== null && (
                            <motion.strong
                              className={classNames(
                                `border-b-2  border-opacity-0`,
                                `
                            ${upOrDown > 0 ? `${styles.upEffect}` : ''}
                            `,
                                `
                            ${upOrDown < 0 ? `${styles.downEffect}` : ''}
                            `
                              )}
                            >
                              {cost}원
                            </motion.strong>
                          )}
                        </TableCell>
                        <TableCell scope="row">
                          <strong
                            className={classNames(`
                     ${upOrDown > 0 ? 'text-red-400' : ' text-blue-400'}
                     `)}
                          >
                            {item.r}%
                          </strong>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table> 
          */

  const onClick =
    (data: any) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
  useEffect(() => {
    const r = sortFn({
      sortBy,
      sortDirection,
      // keyword,
    });
    setSortList(r);
  }, [drawTicker]);

  useEffect(() => {
    if (viewMode === 'favorite') {
      setSortBy(['isFavorite']);
      const r = sortFn({
        sortBy: ['isFavorite'],
        sortDirection,
      });
      setSortList(r);
    } else {
      setSortBy(['coinName']);
      const r = sortFn({
        sortBy: ['coinName'],
        sortDirection,
      });
      setSortList(r);
    }
  }, [viewMode]);
  /**
   *
   * @param param0
   * @returns
   */
  const sortFn = ({
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

  const sortState = createMultiSort(sortFn);

  return (
    <div>
      <div>
        <Box
          direction="row"
          background={'light-5'}
          width="100%"
          className={classNames('flex flex-row justify-start items-center')}
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
                          const parseList = list
                            .replace('[', '')
                            .replace(']', '')
                            .replace(/\"/g, '')
                            .split(',');
                          const coin = `${e.rowData.coinType}_${e.rowData.m}`;
                          const isIndex = parseList.findIndex(
                            (item) => item === coin
                          );
                          if (isIndex !== -1) {
                            parseList.splice(isIndex, 1);
                          } else {
                            const coin = `"${e.rowData.coinType}_${e.rowData.m}"`;
                            parseList.push(coin);
                          }
                          const cookieValue = `[${parseList}]`;
                          setCookie('marketFavoritesCoin', cookieValue, 1);
                          const next = produce(drawTicker, (item) => {
                            const a = item.find(
                              (item) => item.coinSymbol === e.rowData.coinSymbol
                            );
                            if (a) {
                              a.isFavorite = !a.isFavorite;
                            }
                          });
                          setDrawTicker(next);
                        }}
                      >
                        {e.rowData.isFavorite ? (
                          <StarRateIcon />
                        ) : (
                          <StarBorderIcon />
                        )}
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
                          {e.rowData.coinSymbol}/
                          {e.rowData.m === 'C0100' ? 'KRW' : ''}
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
