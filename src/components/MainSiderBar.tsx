import { Box } from 'grommet';
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// import { OrderBook, TradeHistory } from 'react-trading-ui';
import { useRecoilValue } from 'recoil';
import { Doughnut, Bar } from 'react-chartjs-2';

import {
  IOrderBookReceiverTypes,
  orderbookdepthReceiveState,
  OrderBookReceiverListType,
} from '../atom/user.atom';
import classNames from 'classnames';
import produce from 'immer';

const MainSiderBar = () => {
  const or = useRecoilValue(orderbookdepthReceiveState);
  const [originData, setOriginData] = useState<OrderBookReceiverListType[]>([]);
  const [drawData, setDrawData] = useState<OrderBookReceiverListType[]>([]);
  const CONST_DISPALY_COUNT = 40;

  useEffect(() => {
    const rawData = or as IOrderBookReceiverTypes;
    if (rawData) {
      if (originData.length === 0) {
        // 원본 배열에는 데이터를 계속 넣는다.
        setOriginData(rawData.content.list);
        return;
      }
      // list배열을 돌면서 데이터 배열을 다 훑으면서 심볼과 금액이 있다면 기존데이터배열에 갱신하고 없다면 추가
      const origin = produce(originData, (draft) => {
        //result 원본배열
        for (let i = 0; i < rawData.content.list.length - 1; i++) {
          const { symbol, price } = rawData.content.list[i];
          for (let j = 0; j < draft.length - 1; j++) {
            if (draft[j].symbol === symbol && draft[j].price === price) {
              draft[j].price = price;
              return;
            }
          }
          draft.push(rawData.content.list[i]);
          if (draft.length >= 500) {
            draft.shift();
          }
        }
      });
      // 데이터가 12시간전 데이터는 삭제한다.
      //원본데이터는 저장을한다.
      setOriginData(origin);

      const draw = produce(originData, (draft) => {
        //정렬은 다른곳에서.
        draft.sort((a, b) => Number(b.price) - Number(a.price));
        const complement = Math.ceil((draft.length - CONST_DISPALY_COUNT) / 2);
        draft.splice(0, complement);
        draft.splice(draft.length - 1 - complement);
      });
      setDrawData(draw);
    }
  }, [or]);
  return (
    <div
      className="h-full "
      style={{
        gridRowStart: 1,
        gridRowEnd: -1,
        gridColumnStart: 2,
        gridColumnEnd: -1,
      }}
    >
      <Box background={'light-5'} height="100%" width={'100%'}>
        <div
          className="grid h-full w-full"
          style={{
            gridTemplateColumns: '50% 50%',
            gridTemplateRows: '7% auto',
          }}
        >
          {/* 사이드 헤더 */}
          <Box
            direction="row"
            style={{
              gridRowStart: 1,
              gridRowEnd: 1,
              gridColumnStart: 1,
              gridColumnEnd: 2,
            }}
          >
            <div className="w-full h-full flex justify-center items-center">
              <div>가격 (KRW)</div>
            </div>
          </Box>
          <Box
            direction="row"
            style={{
              gridRowStart: 1,
              gridRowEnd: 1,
              gridColumnStart: 2,
              gridColumnEnd: 3,
            }}
          >
            <div className="w-full h-full flex justify-center items-center">
              <div>수량 (BTC)</div>
            </div>
          </Box>

          {/* 사이드 본문 */}
          <Box
            direction="column"
            overflow={'scroll'}
            style={{
              gridRowStart: 2,
              gridRowEnd: -1,
              gridColumnStart: 1,
              gridColumnEnd: -1,
            }}
          >
            <div className="h-full">
              {drawData.map((item) => {
                return (
                  <div className="grid grid-cols-2 grid-rows-1">
                    <div
                      className={classNames(
                        `flex ml-2 justify-start items-center`,
                        `${
                          item.orderType === 'ask'
                            ? 'text-blue-400'
                            : 'text-red-400'
                        }`
                      )}
                    >
                      <span>{item.price}</span>
                    </div>
                    <div className="flex justify-end items-center">
                      <span>{item.quantity}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* <div>가격 (KRW)</div> */}
            {/* <div>수량 (BTC)</div> */}
          </Box>
        </div>
        {/* <Bar data={data} options={options} /> */}
      </Box>
    </div>
  );
};
export default MainSiderBar;
