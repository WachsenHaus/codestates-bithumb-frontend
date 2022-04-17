/* eslint-disable @typescript-eslint/no-redeclare */
import React, { useEffect, useRef, useState } from 'react';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import produce from 'immer';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import styles from './animation.module.css';
import classNames from 'classnames';
import { Box, Button } from 'grommet';
import { atomDrawTicker, TypeDrawTicker } from '../atom/drawData.atom';
import { motion } from 'framer-motion';
import hangul from 'hangul-js';
import { debounce } from 'lodash';

import {
  Column,
  createTableMultiSort,
  SortDirection,
  Table,
} from 'react-virtualized';
import { Autocomplete, Input, Paper, TextField } from '@mui/material';
import { atomSelectCoin } from '../atom/selectCoin.atom';
import { atomCoinList } from '../atom/coinList.atom';
import {
  createMultiSort,
  SortIndicator,
  TableHeaderProps,
  TableHeaderRenderer,
} from 'react-virtualized/dist/es/Table';

import _ from 'lodash';

type ButtonTypes = 'KRW' | 'BTC' | 'FAVOURITE';

/**
 *
 * @returns 티커가 그려지는 메인 바텀 푸터입니다.
 */
const MainFooter = () => {
  const drawTicker = useRecoilValue(atomDrawTicker);
  const [selectCoin, setSelectCoin] = useRecoilState(atomSelectCoin);
  const [sortBy, setSortBy] = useState<any>('coinName');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');

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
      setSelectCoin((prevData) => {
        return {
          ...prevData,
          coinType: data.coinType,
          coinSymbol: data.coinSymbol,
        };
      });
    };

  // const sortState = createMultiSort(sort);

  // const HeaderRenderer: TableHeaderRenderer = (e: TableHeaderProps) => {
  //   console.log(e);

  //   const showSortIndicator = sortState.sortBy.includes(e.dataKey);
  //   console.log(showSortIndicator);
  //   return (
  //     <>
  //       <span>{e.label}</span>
  //       {showSortIndicator && (
  //         <SortIndicator sortDirection={sortState.sortDirection[e.dataKey]} />
  //       )}
  //     </>
  //   );
  // };

  useEffect(() => {
    const r = sortFn({
      sortBy,
      sortDirection,
      // keyword,
    });
    setSortList(r);
  }, [drawTicker]);

  // useEffect(() => {
  //   if (keywordRef.current.length === 0) {
  //     setFlag(false);
  //   } else {
  //     setFlag(true);
  //   }
  // }, [keywordRef.current]);

  /**
   *
   * @param param0
   * @returns
   */
  const sortFn = ({
    sortBy,
    sortDirection,
    keyword,
  }: {
    sortBy: any;
    sortDirection: any;
    keyword?: string;
  }) => {
    // draw하는부분에다가 속성으로 검색용 키워드를 집어넣어야겠네,
    const a = _.filter(drawTicker, (i) => {
      return i.consonant?.toLowerCase().indexOf(keywordRef.current) !== -1;
    });

    return a;
  };

  // const sort = ({
  //   sortBy,
  //   sortDirection,
  // }: {
  //   sortBy: any;
  //   sortDirection: any;
  // }) => {
  //   setSortDirection('ASC');
  //   const sortedList = sortFn({
  //     sortBy,
  //     sortDirection,
  //   });
  //   setSortList(sortedList);
  //   setSortBy(sortBy);
  // };

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
            secondary
            size="large"
            margin="small"
            label="원화 마켓"
            type="button"
          />

          <Button
            size="large"
            type="button"
            margin="small"
            color="doc"
            label="BTC 마켓"
          />
          <TextField
            onChange={(e) => {
              // console.log(e.target.value);
              keywordRef.current = e.target.value;
            }}
            // value={keywordRef.current}
            // onke
            // onChange={(e) => {
            //   console.log(e.target.);
            //   console.log(e.currentTarget);
            // }}

            // onChange={(e) => {
            //   // console.log(e.nativeEvent);
            //   // keywordRef.current = e.key;
            //   console.log(keywordRef.current.valueOf());
            // }}

            // disablePortal
            // id="combo-box-demo"
            // spellCheck={'true'}
            // options={[
            //   { label: '이더리움ㅇㄷㄹㅇ', year: 1994, spell: 'ㅇㄷㄹㅇ' },
            //   { label: 'The Godfather', year: 1972 },
            // ]}
            // sx={{ width: 300 }}
            // renderInput={(params) => <TextField {...params} label="aa" />}
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
                // sort={sort}

                sortBy={sortBy}
                sortDirection={sortDirection}
                width={width}
                height={height}
                headerHeight={50}
                rowHeight={50}
                rowCount={sortList.length}
                rowClassName={classNames(`flex`)}
                rowGetter={({ index }) => {
                  // return drawTicker[index];
                  return sortList[index];
                }}
              >
                <Column
                  width={width * 0.2}
                  label="자산"
                  dataKey="coinName"
                  // headerRenderer={HeaderRenderer}
                  // columnData={{
                  //   coinName: 'aa',
                  // }}
                  cellRenderer={(e) => {
                    // setMKey({
                    //   coinName: e.rowData.coinName,
                    //   coinNameEn: e.rowData.coinNameEn,
                    //   coinSymbol: e.rowData.coinSymbol,
                    // });
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
