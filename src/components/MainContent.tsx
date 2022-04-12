import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
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
  const wrapperRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (wrapperRef.current) {
      const chart = createChart(wrapperRef.current, {
        width: 400,
        height: 300,

        // grid: {
        //   horzLines: {
        //     visible: true,
        //   },
        //   vertLines: {
        //     visible: true,
        //   },
        // },
      });
      const volumeSeries = chart.addHistogramSeries({
        priceFormat: {
          type: 'volume',
        },
        priceLineVisible: false,
        color: 'rgba(76, 175, 80, 0.5)',
        priceScaleId: '',
        scaleMargins: {
          top: 0.85,
          bottom: 0,
        },
      });
      const lineSeries = chart.addCandlestickSeries();
      lineSeries.setData([
        {
          time: '2018-10-19',
          open: 180.34,
          high: 180.99,
          low: 178.57,
          close: 179.85,
        },
        {
          time: '2018-10-22',
          open: 180.82,
          high: 181.4,
          low: 177.56,
          close: 178.75,
        },
        {
          time: '2018-10-23',
          open: 175.77,
          high: 179.49,
          low: 175.44,
          close: 178.53,
        },
        {
          time: '2018-10-24',
          open: 178.58,
          high: 182.37,
          low: 176.31,
          close: 176.97,
        },
        {
          time: '2018-10-25',
          open: 177.52,
          high: 180.5,
          low: 176.83,
          close: 179.07,
        },
        {
          time: '2018-10-26',
          open: 176.88,
          high: 177.34,
          low: 170.91,
          close: 172.23,
        },
        {
          time: '2018-10-29',
          open: 173.74,
          high: 175.99,
          low: 170.95,
          close: 173.2,
        },
        {
          time: '2018-10-30',
          open: 173.16,
          high: 176.43,
          low: 172.64,
          close: 176.24,
        },
        {
          time: '2018-10-31',
          open: 177.98,
          high: 178.85,
          low: 175.59,
          close: 175.88,
        },
        {
          time: '2018-11-01',
          open: 176.84,
          high: 180.86,
          low: 175.9,
          close: 180.46,
        },
        {
          time: '2018-11-02',
          open: 182.47,
          high: 183.01,
          low: 177.39,
          close: 179.93,
        },
        {
          time: '2018-11-05',
          open: 181.02,
          high: 182.41,
          low: 179.3,
          close: 182.19,
        },
      ]);

      volumeSeries.setData([
        { time: '2018-10-19', value: 219.31 },
        { time: '2018-10-22', value: 220.65 },
        { time: '2018-10-23', value: 222.73 },
        { time: '2018-10-24', value: 215.09 },
        { time: '2018-10-25', value: 219.8 },
        { time: '2018-10-26', value: 216.3 },
        { time: '2018-10-29', value: 212.24 },
        { time: '2018-10-30', value: 213.3 },
        { time: '2018-10-31', value: 218.86 },
        { time: '2018-11-01', value: 222.22 },
        { time: '2018-11-02', value: 207.48 },
        { time: '2018-11-05', value: 201.59 },
        { time: '2018-11-06', value: 203.77 },
        { time: '2018-11-07', value: 209.95 },
        { time: '2018-11-08', value: 208.49 },
        { time: '2018-11-09', value: 204.47 },
        { time: '2018-11-12', value: 194.17 },
        { time: '2018-11-13', value: 192.23 },
        { time: '2018-11-14', value: 186.8 },
        { time: '2018-11-15', value: 191.41 },
        { time: '2018-11-16', value: 193.53 },
        { time: '2018-11-19', value: 185.86 },
        { time: '2018-11-20', value: 176.98 },
        { time: '2018-11-21', value: 176.78 },
        { time: '2018-11-23', value: 172.29 },
        { time: '2018-11-26', value: 174.62 },
        { time: '2018-11-27', value: 174.24 },
        { time: '2018-11-28', value: 180.94 },
        { time: '2018-11-29', value: 179.55 },
        { time: '2018-11-30', value: 178.58 },
        { time: '2018-12-03', value: 184.82 },
        { time: '2018-12-04', value: 176.69 },
        { time: '2018-12-06', value: 174.72 },
        { time: '2018-12-07', value: 168.49 },
        { time: '2018-12-10', value: 169.6 },
        { time: '2018-12-11', value: 168.63 },
        { time: '2018-12-12', value: 169.1 },
        { time: '2018-12-13', value: 170.95 },
        { time: '2018-12-14', value: 165.48 },
        { time: '2018-12-17', value: 163.94 },
        { time: '2018-12-18', value: 166.07 },
        { time: '2018-12-19', value: 160.89 },
        { time: '2018-12-20', value: 156.83 },
        { time: '2018-12-21', value: 150.73 },
        { time: '2018-12-24', value: 146.83 },
        { time: '2018-12-26', value: 157.17 },
        { time: '2018-12-27', value: 156.15 },
        { time: '2018-12-28', value: 156.23 },
        { time: '2018-12-31', value: 157.74 },
        { time: '2019-01-02', value: 157.92 },
        { time: '2019-01-03', value: 142.19 },
        { time: '2019-01-04', value: 148.26 },
        { time: '2019-01-07', value: 147.93 },
        { time: '2019-01-08', value: 150.75 },
        { time: '2019-01-09', value: 153.31 },
        { time: '2019-01-10', value: 153.8 },
        { time: '2019-01-11', value: 152.29 },
        { time: '2019-01-14', value: 150.0 },
        { time: '2019-01-15', value: 153.07 },
        { time: '2019-01-16', value: 154.94 },
        { time: '2019-01-17', value: 155.86 },
        { time: '2019-01-18', value: 156.82 },
        { time: '2019-01-22', value: 153.3 },
        { time: '2019-01-23', value: 153.92 },
        { time: '2019-01-24', value: 152.7 },
        { time: '2019-01-25', value: 157.76 },
        { time: '2019-01-28', value: 156.3 },
        { time: '2019-01-29', value: 154.68 },
        { time: '2019-01-30', value: 165.25 },
        { time: '2019-01-31', value: 166.44 },
        { time: '2019-02-01', value: 166.52 },
        { time: '2019-02-04', value: 171.25 },
        { time: '2019-02-05', value: 174.18 },
        { time: '2019-02-06', value: 174.24 },
        { time: '2019-02-07', value: 170.94 },
        { time: '2019-02-08', value: 170.41 },
        { time: '2019-02-11', value: 169.43 },
        { time: '2019-02-12', value: 170.89 },
        { time: '2019-02-13', value: 170.18 },
        { time: '2019-02-14', value: 170.8 },
        { time: '2019-02-15', value: 170.42 },
        { time: '2019-02-19', value: 170.93 },
        { time: '2019-02-20', value: 172.03 },
        { time: '2019-02-21', value: 171.06 },
        { time: '2019-02-22', value: 172.97 },
        { time: '2019-02-25', value: 174.23 },
        { time: '2019-02-26', value: 174.33 },
        { time: '2019-02-27', value: 174.87 },
        { time: '2019-02-28', value: 173.15 },
        { time: '2019-03-01', value: 174.97 },
        { time: '2019-03-04', value: 175.85 },
        { time: '2019-03-05', value: 175.53 },
        { time: '2019-03-06', value: 174.52 },
        { time: '2019-03-07', value: 172.5 },
        { time: '2019-03-08', value: 172.91 },
        { time: '2019-03-11', value: 178.9 },
        { time: '2019-03-12', value: 180.91 },
        { time: '2019-03-13', value: 181.71 },
        { time: '2019-03-14', value: 183.73 },
        { time: '2019-03-15', value: 186.12 },
        { time: '2019-03-18', value: 188.02 },
        { time: '2019-03-19', value: 186.53 },
        { time: '2019-03-20', value: 188.16 },
        { time: '2019-03-21', value: 195.09 },
        { time: '2019-03-22', value: 191.05 },
        { time: '2019-03-25', value: 188.74 },
        { time: '2019-03-26', value: 186.79 },
        { time: '2019-03-27', value: 188.47 },
        { time: '2019-03-28', value: 188.72 },
        { time: '2019-03-29', value: 189.95 },
        { time: '2019-04-01', value: 191.24 },
        { time: '2019-04-02', value: 194.02 },
        { time: '2019-04-03', value: 195.35 },
        { time: '2019-04-04', value: 195.69 },
        { time: '2019-04-05', value: 197.0 },
        { time: '2019-04-08', value: 200.1 },
        { time: '2019-04-09', value: 199.5 },
        { time: '2019-04-10', value: 200.62 },
        { time: '2019-04-11', value: 198.95 },
        { time: '2019-04-12', value: 198.87 },
        { time: '2019-04-15', value: 199.23 },
        { time: '2019-04-16', value: 199.25 },
        { time: '2019-04-17', value: 203.13 },
        { time: '2019-04-18', value: 203.86 },
        { time: '2019-04-22', value: 204.53 },
        { time: '2019-04-23', value: 207.48 },
        { time: '2019-04-24', value: 207.16 },
        { time: '2019-04-25', value: 205.28 },
        { time: '2019-04-26', value: 204.3 },
        { time: '2019-04-29', value: 204.61 },
        { time: '2019-04-30', value: 200.67 },
        { time: '2019-05-01', value: 210.52 },
        { time: '2019-05-02', value: 209.15 },
        { time: '2019-05-03', value: 211.75 },
        { time: '2019-05-06', value: 208.48 },
        { time: '2019-05-07', value: 202.86 },
        { time: '2019-05-08', value: 202.9 },
        { time: '2019-05-09', value: 200.72 },
        { time: '2019-05-10', value: 197.18 },
        { time: '2019-05-13', value: 185.72 },
        { time: '2019-05-14', value: 188.66 },
        { time: '2019-05-15', value: 190.92 },
        { time: '2019-05-16', value: 190.08 },
        { time: '2019-05-17', value: 189.0 },
        { time: '2019-05-20', value: 183.09 },
        { time: '2019-05-21', value: 186.6 },
        { time: '2019-05-22', value: 182.78 },
        { time: '2019-05-23', value: 179.66 },
        { time: '2019-05-24', value: 178.97 },
        { time: '2019-05-28', value: 178.67 },
      ]);

      volumeSeries.setData([
        { time: '2018-10-19', value: 33078726.0 },
        { time: '2018-10-22', value: 28792082.0 },
        { time: '2018-10-23', value: 38767846.0 },
        { time: '2018-10-24', value: 40925163.0 },
        { time: '2018-10-25', value: 29855768.0 },
        { time: '2018-10-26', value: 47258375.0 },
        { time: '2018-10-29', value: 45935520.0 },
        { time: '2018-10-30', value: 36659990.0 },
        { time: '2018-10-31', value: 38358933.0 },
        { time: '2018-11-01', value: 58323180.0 },
        { time: '2018-11-02', value: 91328654.0 },
        { time: '2018-11-05', value: 66163669.0 },
        { time: '2018-11-06', value: 31882881.0 },
        { time: '2018-11-07', value: 33424434.0 },
        { time: '2018-11-08', value: 25362636.0 },
        { time: '2018-11-09', value: 34365750.0 },
        { time: '2018-11-12', value: 51135518.0 },
        { time: '2018-11-13', value: 46882936.0 },
        { time: '2018-11-14', value: 60800957.0 },
        { time: '2018-11-15', value: 46478801.0 },
        { time: '2018-11-16', value: 36928253.0 },
        { time: '2018-11-19', value: 41920872.0 },
        { time: '2018-11-20', value: 67825247.0 },
        { time: '2018-11-21', value: 31124210.0 },
        { time: '2018-11-23', value: 23623972.0 },
        { time: '2018-11-26', value: 44998520.0 },
        { time: '2018-11-27', value: 41387377.0 },
        { time: '2018-11-28', value: 46062539.0 },
        { time: '2018-11-29', value: 41769992.0 },
        { time: '2018-11-30', value: 39531549.0 },
        { time: '2018-12-03', value: 40798002.0 },
        { time: '2018-12-04', value: 41344282.0 },
        { time: '2018-12-06', value: 43098410.0 },
        { time: '2018-12-07', value: 42281631.0 },
        { time: '2018-12-10', value: 62025994.0 },
        { time: '2018-12-11', value: 47281665.0 },
        { time: '2018-12-12', value: 35627674.0 },
        { time: '2018-12-13', value: 31897827.0 },
        { time: '2018-12-14', value: 40703710.0 },
        { time: '2018-12-17', value: 44287922.0 },
        { time: '2018-12-18', value: 33841518.0 },
        { time: '2018-12-19', value: 49047297.0 },
        { time: '2018-12-20', value: 64772960.0 },
        { time: '2018-12-21', value: 95744384.0 },
        { time: '2018-12-24', value: 37169232.0 },
        { time: '2018-12-26', value: 58582544.0 },
        { time: '2018-12-27', value: 53117065.0 },
        { time: '2018-12-28', value: 42291424.0 },
        { time: '2018-12-31', value: 35003466.0 },
        { time: '2019-01-02', value: 37039737.0 },
        { time: '2019-01-03', value: 91312195.0 },
        { time: '2019-01-04', value: 58607070.0 },
        { time: '2019-01-07', value: 54777764.0 },
        { time: '2019-01-08', value: 41025314.0 },
        { time: '2019-01-09', value: 45099081.0 },
        { time: '2019-01-10', value: 35780670.0 },
        { time: '2019-01-11', value: 27023241.0 },
        { time: '2019-01-14', value: 32439186.0 },
        { time: '2019-01-15', value: 28710324.0 },
        { time: '2019-01-16', value: 30569706.0 },
        { time: '2019-01-17', value: 29821160.0 },
        { time: '2019-01-18', value: 33751023.0 },
        { time: '2019-01-22', value: 30393970.0 },
        { time: '2019-01-23', value: 23130570.0 },
        { time: '2019-01-24', value: 25441549.0 },
        { time: '2019-01-25', value: 33547893.0 },
        { time: '2019-01-28', value: 26192058.0 },
        { time: '2019-01-29', value: 41587239.0 },
        { time: '2019-01-30', value: 61109780.0 },
        { time: '2019-01-31', value: 40739649.0 },
        { time: '2019-02-01', value: 32668138.0 },
        { time: '2019-02-04', value: 31495582.0 },
        { time: '2019-02-05', value: 36101628.0 },
        { time: '2019-02-06', value: 28239591.0 },
        { time: '2019-02-07', value: 31741690.0 },
        { time: '2019-02-08', value: 23819966.0 },
        { time: '2019-02-11', value: 20993425.0 },
        { time: '2019-02-12', value: 22283523.0 },
        { time: '2019-02-13', value: 22490233.0 },
        { time: '2019-02-14', value: 21835747.0 },
        { time: '2019-02-15', value: 24626814.0 },
        { time: '2019-02-19', value: 18972826.0 },
        { time: '2019-02-20', value: 26114362.0 },
        { time: '2019-02-21', value: 17249670.0 },
        { time: '2019-02-22', value: 18913154.0 },
        { time: '2019-02-25', value: 21873358.0 },
        { time: '2019-02-26', value: 17070211.0 },
        { time: '2019-02-27', value: 27835389.0 },
        { time: '2019-02-28', value: 28215416.0 },
        { time: '2019-03-01', value: 25886167.0 },
        { time: '2019-03-04', value: 27436203.0 },
        { time: '2019-03-05', value: 19737419.0 },
        { time: '2019-03-06', value: 20810384.0 },
        { time: '2019-03-07', value: 24796374.0 },
        { time: '2019-03-08', value: 23999358.0 },
        { time: '2019-03-11', value: 32011034.0 },
        { time: '2019-03-12', value: 32467584.0 },
        { time: '2019-03-13', value: 31032524.0 },
        { time: '2019-03-14', value: 23579508.0 },
        { time: '2019-03-15', value: 39042912.0 },
        { time: '2019-03-18', value: 26219832.0 },
        { time: '2019-03-19', value: 31646369.0 },
        { time: '2019-03-20', value: 31035231.0 },
        { time: '2019-03-21', value: 51034237.0 },
        { time: '2019-03-22', value: 42407666.0 },
        { time: '2019-03-25', value: 43845293.0 },
        { time: '2019-03-26', value: 49800538.0 },
        { time: '2019-03-27', value: 29848427.0 },
        { time: '2019-03-28', value: 20780363.0 },
        { time: '2019-03-29', value: 23563961.0 },
        { time: '2019-04-01', value: 27861964.0 },
        { time: '2019-04-02', value: 22765732.0 },
        { time: '2019-04-03', value: 23271830.0 },
        { time: '2019-04-04', value: 19114275.0 },
        { time: '2019-04-05', value: 18526644.0 },
        { time: '2019-04-08', value: 25881697.0 },
        { time: '2019-04-09', value: 35768237.0 },
        { time: '2019-04-10', value: 21695288.0 },
        { time: '2019-04-11', value: 20900808.0 },
        { time: '2019-04-12', value: 27760668.0 },
        { time: '2019-04-15', value: 17536646.0 },
        { time: '2019-04-16', value: 25696385.0 },
        { time: '2019-04-17', value: 28906780.0 },
        { time: '2019-04-18', value: 24195766.0 },
        { time: '2019-04-22', value: 19439545.0 },
        { time: '2019-04-23', value: 23322991.0 },
        { time: '2019-04-24', value: 17540609.0 },
        { time: '2019-04-25', value: 18543206.0 },
        { time: '2019-04-26', value: 18649102.0 },
        { time: '2019-04-29', value: 22204716.0 },
        { time: '2019-04-30', value: 46534923.0 },
        { time: '2019-05-01', value: 64827328.0 },
        { time: '2019-05-02', value: 31996324.0 },
        { time: '2019-05-03', value: 20892378.0 },
        { time: '2019-05-06', value: 32443113.0 },
        { time: '2019-05-07', value: 38763698.0 },
        { time: '2019-05-08', value: 26339504.0 },
        { time: '2019-05-09', value: 34908607.0 },
        { time: '2019-05-10', value: 41208712.0 },
        { time: '2019-05-13', value: 57430623.0 },
        { time: '2019-05-14', value: 36529677.0 },
        { time: '2019-05-15', value: 26544718.0 },
        { time: '2019-05-16', value: 33031364.0 },
        { time: '2019-05-17', value: 32879090.0 },
        { time: '2019-05-20', value: 38690198.0 },
        { time: '2019-05-21', value: 28364848.0 },
        { time: '2019-05-22', value: 29748556.0 },
        { time: '2019-05-23', value: 36217464.0 },
        { time: '2019-05-24', value: 23714686.0 },
        { time: '2019-05-28', value: 9264013.0 },
      ]);
    }

    return () => {
      wrapperRef.current = null;
    };
  }, [wrapperRef.current]);

  return (
    <div
      className="opacity-90"
      style={{
        gridRowStart: 2,
        gridRowEnd: 3,
        gridColumn: 1,
      }}
    >
      <div className="relative h-full" ref={wrapperRef}></div>
    </div>
  );
};
export default MainContent;
