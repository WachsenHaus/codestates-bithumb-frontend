import { Box } from 'grommet';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
  TransactionReceiverListType,
  transactionReceiveState,
} from '../atom/user.atom';
import classNames from 'classnames';
import produce from 'immer';
import moment from 'moment';

const CONST_DISPALY_COUNT = 36;

const MainSiderBar = () => {
  const or = useRecoilValue(orderbookdepthReceiveState);
  const transaction = useRecoilValue(transactionReceiveState);
  const [originData, setOriginData] = useState<OrderBookReceiverListType[]>([]);
  const [drawData, setDrawData] = useState<OrderBookReceiverListType[]>([]);
  const [transactionList, setTransactionList] = useState<
    TransactionReceiverListType[]
  >([]);

  useEffect(() => {
    const { list } = transaction.content;
    if (list) {
      if (transactionList.length === 0) {
        setTransactionList(list);
        return;
      }
      const next = produce(transactionList, (draft) => {
        //result 원본배열
        for (let i = 0; i < list.length; i++) {
          const { symbol } = list[i];
          for (let j = 0; j < draft.length; j++) {
            if (draft[j].symbol !== symbol) {
              draft.splice(0);
              return;
            }
          }
          draft.push(list[i]);
          if (draft.length >= 40) {
            draft.shift();
          }
        }
      });
      setTransactionList(next);
    }
    // console.log(transactionList);

    // transaction.content.list
  }, [transaction.content.list]);

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
        for (let i = 0; i < rawData.content.list.length; i++) {
          const { symbol, price, orderType, quantity } =
            rawData.content.list[i];
          for (let j = 0; j < draft.length; j++) {
            try {
              if (draft[j].symbol === symbol) {
                if (draft[j].price === price) {
                  // draft[j].orderType = orderType;
                  // draft[j].quantity = quantity;
                  return;
                }
              }
            } catch (err) {
              console.log(err);
            }
          }
          draft.push(rawData.content.list[i]);
          if (draft.length >= 1000) {
            draft.shift();
          }
        }
      });

      //원본데이터는 저장을한다.
      setOriginData(origin);
    }
  }, [or]);

  useEffect(() => {
    const { list } = transaction.content;
    if (originData.length === 0) {
      // 원본 배열에는 데이터를 계속 넣는다.
      if (list) {
        const addOpenPrice: OrderBookReceiverListType = {
          price: list[list.length - 1].contPrice,
          orderType: 'bid',
          quantity: list[list.length - 1].contQty,
          symbol: list[list.length - 1].symbol,
          total: '',
        };
        // draft.push(addOpenPrice);
        setOriginData([addOpenPrice]);
        return;
      }
    }
    if (list) {
      // console.log(list);
      const origin = produce(originData, (draft) => {
        //result 원본배열
        for (let i = 0; i < list.length; i++) {
          const { symbol, contPrice, contQty } = list[i];
          for (let j = 0; j < draft.length; j++) {
            if (draft[j].symbol === symbol) {
              if (draft[j].price === contPrice) {
                draft[j].price = contPrice;
                draft[j].orderType = 'bid';
                draft[j].quantity = contQty;
                return;
              }
            }
          }
          const addOpenPrice: OrderBookReceiverListType = {
            price: contPrice,
            orderType: 'bid',
            quantity: transaction.content.list[0].contQty,
            symbol: transaction.content.list[0].symbol,
            total: '',
          };
          draft.push(addOpenPrice);
        }
      });
      setOriginData(origin);
    }
  }, [transaction]);

  useEffect(() => {
    // const { openPrice } = ticker.content;
    const { contPrice } = transaction.content.list[0];

    const draw = produce(originData, (draft) => {
      //정렬은 다른곳에서.
      draft.sort((a, b) => Number(b.price) - Number(a.price));
      const index = draft.findIndex((item) => {
        return item.price === contPrice;
      });
      if (index !== -1) {
        for (let i = 0; i < draft.length; i++) {
          if (i < index) {
            // console.log(i);
            draft[i].orderType = 'ask';
          } else {
            draft[i].orderType = 'bid';
          }
        }
        const complement = Math.ceil(CONST_DISPALY_COUNT / 2);
        // console.log(complement);
        // console.log(index);
        const left = index - complement;

        if (index > left) {
          draft.splice(0, left);
        }
      }

      // const nextIndex = draft.findIndex((item) => {
      //   return item.price === contPrice;
      // });
      // if (nextIndex !== -1) {
      //   for (let i = 0; i < draft.length; i++) {
      //     if (i < nextIndex) {
      //       draft[i].orderType = 'ask';
      //     } else {
      //       draft[i].orderType = 'bid';
      //     }
      //   }
      //   const complement = Math.ceil(CONST_DISPALY_COUNT / 2);
      //   const right = index + complement;
      //   if (right > index) {
      //     draft.splice(right);
      //   }
      // }
    });
    setDrawData(draw);
  }, [or]);

  /**
   * 체결내역 데이터를 관리함
   */
  // useEffect(() => {}, [transaction]);

  return (
    <div
      // className="h-full"
      style={{
        gridRowStart: 1,
        gridRowEnd: -1,
        gridColumnStart: 2,
        gridColumnEnd: -1,
        width: '100%',
        height: '100%',
      }}
    >
      <Box background={'light-2'} height="100%">
        <div
          className="grid "
          style={{
            height: '100%',
            gridTemplateColumns: '50% auto',
            gridTemplateRows: '7% auto',
          }}
        >
          {/* 사이드 헤더 */}
          <div
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
          </div>
          <div
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
          </div>

          {/* 사이드 본문 */}
          <Box
            // direction="column"
            overflow={'hidden'}
            style={{
              display: 'grid',
              gridRowStart: 2,
              gridRowEnd: -1,
              gridColumnStart: 1,
              gridColumnEnd: -1,
              height: '100%',
            }}
          >
            <div
              // className="h-full"
              style={{
                height: '700px',
                minHeight: '700px',
              }}
            >
              {drawData.map((item, index) => {
                return (
                  index < CONST_DISPALY_COUNT && (
                    <div
                      className="grid grid-cols-2 grid-rows-1"
                      // key={`${item.price}_${item.quantity}_${item.orderType}`}
                    >
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
                  )
                );
              })}
            </div>
            <Box
              style={{
                gridTemplateColumns: 'auto',
                gridTemplateRows: '10% 10% auto',
                // height: '200px',
              }}
            >
              <div>체결내역</div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '30% 40% auto',
                  gridTemplateRows: 'auto',
                }}
              >
                <div className="w-full flex justify-center items-center">
                  시간
                </div>
                <div className="w-full flex justify-center items-center">
                  가격
                </div>
                <div className="w-full flex justify-center items-center">
                  수량(BTC)
                </div>
              </div>
              <div className="grid grid-cols-1 grid-rows-1 h-64">
                <div className="flex  flex-col">
                  {transactionList.map((item, index) => {
                    return (
                      <div
                        // key={`${item.contDtm} + ${item.buySellGb}`}
                        className="grid"
                        style={{
                          gridTemplateColumns: '30% 40% 30%',
                        }}
                      >
                        <div className="flex justify-center items-center">
                          {moment(item.contDtm).format('HH:mm:ss')}
                        </div>
                        <div className="flex justify-center items-center">
                          {item.contPrice}
                        </div>
                        <div className="flex justify-center items-center">
                          {item.contQty}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Box>
          </Box>
        </div>
      </Box>
    </div>
  );
};
export default MainSiderBar;
