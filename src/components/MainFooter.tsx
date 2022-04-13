/* eslint-disable @typescript-eslint/no-redeclare */
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import produce from 'immer';
import styles from './animation.module.css';
import {
  IOrderBookReceiverTypes,
  ITickerReceiverTypes,
  ITransactionReceiverTypes,
  orderbookdepthReceiveState,
  orderbookdepthSenderState,
  orderbookdepthSocketState,
  SocketNamesType,
  tickerReceiveState,
  tickerSenderState,
  tickerSocketState,
  transactionReceiveState,
  transactionSenderState,
  transactionSocketState,
} from '../atom/user.atom';
import CONST from '../const';
import classNames from 'classnames';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'grommet';

type ButtonTypes = 'KRW' | 'BTC' | 'FAVOURITE';

/**
 *
 * @returns 티커가 그려지는 메인 바텀 푸터입니다.
 */
const MainFooter = () => {
  const [rcvTicker, setRcvTicker] = useRecoilState(tickerReceiveState);
  const [senderTicker, setSenderTicker] = useRecoilState(tickerSenderState);

  const [drawData, setDrawData] = useState<ITickerReceiverTypes[]>([]);

  /**
   * 티커정보를 갱신함.
   */
  useEffect(() => {
    if (rcvTicker) {
      if (drawData.length === 0) {
        if (rcvTicker.content.openPrice === '') {
          return;
        }
        setDrawData([rcvTicker]);
        return;
      }
      const next = produce(drawData, (draft) => {
        const index = draft.findIndex(
          (item) => item.content.symbol === rcvTicker.content.symbol
        );
        if (index !== -1) {
          draft[index].content = rcvTicker.content;
        } else {
          draft.push(rcvTicker);
        }
      });
      setDrawData(next);
    }
  }, [rcvTicker]);

  /**
   * 해당 버튼을 클릭할 경우 type에 따라 웹소켓의 통신방식이 변경되어야겠네요
   */
  const onClick =
    (type: ButtonTypes) =>
    (
      e?:
        | React.MouseEvent<HTMLAnchorElement, MouseEvent>
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      switch (type) {
        case 'KRW':
          setDrawData([]);
          setSenderTicker((prevData) => {
            return {
              ...prevData,
              symbols: CONST.ENABLE_KRW_SYMBOL,
            };
          });

          break;
        case 'BTC':
          setDrawData([]);
          setSenderTicker((prevData) => {
            return {
              ...prevData,
              symbols: CONST.ENABLE_BTC_SYMBOL,
            };
          });

          break;
        case 'FAVOURITE':
          break;
        default:
          break;
      }
    };

  return (
    <div
    // className="h-full grid"
    // style={{
    //   gridRowStart: 3,
    //   gridRowEnd: 4,
    //   gridColumn: 1,
    //   gridTemplateRows: '20% 80%',
    //   gridTemplateColumns: 'auto',
    // }}
    >
      <div
      // className="w-full h-full grid"
      // style={{
      //   gridTemplateColumns: 'auto',
      // }}
      >
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
            onClick={onClick('KRW')}
          />

          <Button
            size="large"
            type="button"
            margin="small"
            color="doc"
            label="BTC 마켓"
            onClick={onClick('BTC')}
          />
        </Box>
      </div>
      <div>
        <Box background={'light-2'} width="100%" height="100%">
          <Table>
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
              {drawData.map((item) => {
                return (
                  item.content.openPrice !== '' && (
                    <TableRow>
                      <TableCell scope="row">
                        <strong>{item?.content.symbol}</strong>
                      </TableCell>
                      <TableCell scope="row">
                        <strong
                          className={classNames(
                            `
                          ${
                            rcvTicker.content.symbol === item.content.symbol &&
                            Number(item?.content.chgRate) > 0
                              ? `${styles.upEffect}`
                              : ''
                          }
                          `,
                            `
                          ${
                            rcvTicker.content.symbol === item.content.symbol &&
                            Number(item?.content.chgRate) < 0
                              ? `${styles.downEffect}`
                              : ''
                          }
                          `,
                            `border-b-2  border-opacity-0`
                          )}
                        >
                          {Number(item?.content.openPrice).toLocaleString(
                            'ko-kr'
                          )}
                          원
                        </strong>
                      </TableCell>
                      <TableCell scope="row">
                        <strong
                          className={classNames(`
                        ${
                          Number(item?.content.chgRate) > 0
                            ? 'text-red-400'
                            : ' text-blue-400'
                        }
                        `)}
                        >
                          {item?.content.chgRate}%
                        </strong>
                      </TableCell>
                    </TableRow>
                  )
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </div>
    </div>
  );
};
export default MainFooter;
