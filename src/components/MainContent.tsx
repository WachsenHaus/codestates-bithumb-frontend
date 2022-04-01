import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useRecoilValue } from 'recoil';
import { ITickerReceiverTypes, tickerReceiveState } from '../atom/user.atom';
import produce from 'immer';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
  // Title,
  // Tooltip,
  // Legend
);

const MainContent = () => {
  const labels = ['BTC_KRW'];
  const rcvTicker = useRecoilValue(tickerReceiveState);

  const [drawData, setDrawData] = useState<any[]>();
  useEffect(() => {
    if (rcvTicker.content.symbol !== 'BTC_KRW') {
      return;
    }
    if (!drawData) {
      if (
        rcvTicker.content.openPrice === '' ||
        rcvTicker.content.symbol !== 'BTC_KRW'
      ) {
        return;
      }
      const obj = {
        x: rcvTicker.content.time,
        y: rcvTicker.content.openPrice,
      };
      setDrawData([obj]);
      return;
    }
    setDrawData(
      produce(drawData, (draft) => {
        if (rcvTicker.content.symbol === 'BTC_KRW') {
          const obj = {
            x: rcvTicker.content.time,
            y: rcvTicker.content.openPrice,
          };
          draft?.push(obj);
          if (draft.length > 10000) {
            draft.shift();
          }
        }
      })
    );
  }, [rcvTicker.content]);

  const dddd = {
    labels,
    datasets: [
      {
        data: drawData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  return (
    <div
      className="opacity-90"
      style={{
        gridRowStart: 2,
        gridRowEnd: 3,
        gridColumn: 1,
      }}
    >
      <div className="relative h-full">
        <Line
          data={dddd}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              easing: 'linear',
            },
          }}
        />
      </div>
    </div>
  );
};
export default MainContent;
