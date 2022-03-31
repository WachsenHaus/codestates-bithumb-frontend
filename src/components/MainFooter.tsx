/* eslint-disable @typescript-eslint/no-redeclare */
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import produce from 'immer';
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
  // const userSocket = useRecoilValue(atomSocketsState);

  const [wsTicker, setWsTicker] = useRecoilState(tickerSocketState);
  const [rcvTicker, setRcvTicker] = useRecoilState(tickerReceiveState);
  const [senderTicker, setSenderTicker] = useRecoilState(tickerSenderState);

  const [wsOrder, setWsOrder] = useRecoilState(orderbookdepthSocketState);
  const [rcvOrder, setRcvOrder] = useRecoilState(orderbookdepthReceiveState);
  const [senderOrder, setSenderOrder] = useRecoilState(
    orderbookdepthSenderState
  );

  const [wsTransaction, setWsTransaction] = useRecoilState(
    transactionSocketState
  );
  const [rcvTransaction, setRcvTransaction] = useRecoilState(
    transactionReceiveState
  );
  const [senderTransaction, setSenderTransaction] = useRecoilState(
    transactionSenderState
  );

  // const setSockets = useSetRecoilState(atomSocketsState);
  // const setSocketIdentifier = useSetRecoilState(atomSocketIdentifier);
  // 배열로 해서 코인이름이 같은애만 바꿔치기를하자.
  const [data, setData] = useState<ITickerReceiverTypes[]>([]);

  /**
   * 티커정보를 갱신함.
   */
  useEffect(() => {
    const result = rcvTicker as ITickerReceiverTypes;
    if (result) {
      if (
        data.length === 0
        // (data.length === 1 && data[0].content.symbol === '')
      ) {
        setData([result]);
        return;
      }
      const next = produce(data, (draft) => {
        const index = draft.findIndex(
          (item) => item.content.symbol === result.content.symbol
        );
        if (index !== -1) {
          draft[index].content = result.content;
        } else {
          draft.push(result);
        }
      });
      setData(next);
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
          setData([]);
          setSenderTicker((prevData) => {
            return {
              ...prevData,
              symbols: CONST.ENABLE_KRW_SYMBOL,
            };
          });

          break;
        case 'BTC':
          setData([]);
          setSenderTicker((prevData) => {
            return {
              ...prevData,
              symbols: CONST.ENABLE_BTC_SYMBOL,
            };
          });

          break;
        case 'FAVOURITE':
          // 테스트 코드
          // console.log(userSocket);
          break;
        default:
          break;
      }
    };

  return (
    <div
      className="h-full grid"
      style={{
        gridRowStart: 3,
        gridRowEnd: 4,
        gridColumn: 1,
        gridTemplateRows: '20% 80%',
        gridTemplateColumns: 'auto',
      }}
    >
      <div
        className="w-full h-full grid"
        style={{
          gridTemplateColumns: 'auto 20%',
        }}
      >
        <Box
          direction="row"
          background={'light-5'}
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
          {/* </Box> */}

          <Button
            size="large"
            type="button"
            margin="small"
            label="즐겨 찾기"
            onClick={onClick('FAVOURITE')}
          ></Button>
        </Box>
        <Box
          direction="row"
          background={'light-5'}
          className={classNames('flex flex-row justify-start items-center')}
        >
          <Button
            size="large"
            type="button"
            margin="small"
            label="검색"
            onClick={onClick('FAVOURITE')}
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
                  실시간 시세
                </TableCell>
                <TableCell scope="col" border="bottom">
                  변동률
                </TableCell>
                {/* <TableCell scope="col" border="bottom">
                  거래 금액
                </TableCell>
                <TableCell scope="col" border="bottom">
                  시가 총액
                </TableCell> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => {
                return (
                  <TableRow>
                    <TableCell scope="row">
                      <strong>{item?.content.symbol}</strong>
                    </TableCell>
                    <TableCell scope="row">
                      <strong>{item?.content.openPrice}</strong>
                    </TableCell>
                    <TableCell scope="row">
                      <strong>{item?.content.chgRate}</strong>
                    </TableCell>
                    {/* <TableCell scope="row">
                      <strong>{item?.content.value}</strong>
                    </TableCell>
                    <TableCell scope="row">
                      <strong>{item?.content.volume}</strong>
                    </TableCell> */}
                  </TableRow>
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
