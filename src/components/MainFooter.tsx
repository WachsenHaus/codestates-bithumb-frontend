/* eslint-disable @typescript-eslint/no-redeclare */
import React, { useEffect, useState } from 'react';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import produce from 'immer';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import styles from './animation.module.css';
import classNames from 'classnames';
import { Box, Button } from 'grommet';
import { atomDrawTicker, TypeDrawTicker } from '../atom/drawData.atom';
import { motion } from 'framer-motion';

import { Column, Table } from 'react-virtualized';
import { Paper } from '@mui/material';
import { atomSelectCoin } from '../atom/selectCoin.atom';

type ButtonTypes = 'KRW' | 'BTC' | 'FAVOURITE';

/**
 *
 * @returns 티커가 그려지는 메인 바텀 푸터입니다.
 */
const MainFooter = () => {
  const drawTicker = useRecoilValue(atomDrawTicker);
  const setSelectCoin = useSetRecoilState(atomSelectCoin);
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
      console.log(data);
      setSelectCoin((prevData) => {
        return {
          ...prevData,
          coinType: data.coinType,
          coinSymbol: data.coinSymbol,
          // marketSymbol: data.marketSymbol,
        };
      });
    };

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
                width={width}
                height={height}
                headerHeight={50}
                rowHeight={50}
                rowCount={drawTicker.length}
                rowClassName={classNames(`flex`)}
                rowGetter={({ index }) => {
                  return drawTicker[index];
                }}
              >
                <Column
                  width={width * 0.2}
                  label="자산"
                  dataKey="coinName"
                  cellRenderer={(e) => {
                    return (
                      <div>
                        {e.cellData}
                        <div onClick={onClick(e.rowData)}>
                          {e.rowData.coinSymbol}/
                          {e.rowData.m === 'C0100' ? 'KRW' : ''}
                        </div>
                      </div>
                    );
                  }}
                />
                <Column width={width * 0.4} label="현재가" dataKey="e" />
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
