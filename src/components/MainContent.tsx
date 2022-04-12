import React, { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';
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
import axios from 'axios';

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

  const getChartData = async () => {
    try {
      const result = await axios.get(
        'https://pub2.bithumb.com/public/candlesticknew_trview/C0565_C0100/1M'
      );
      return result.data;
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (wrapperRef.current) {
      (async () => {
        let chartObj = [];
        let volObj = [];
        let result;
        result = await getChartData();
        if (result.data) {
          const idx = result.data.t.length;
          let isUp;
          for (let i = 0; i < idx; i++) {
            chartObj.push({
              time: result.data.t[i],
              open: result.data.o[i],
              high: result.data.h[i],
              low: result.data.l[i],
              close: result.data.c[i],
            });

            if (i === 0) {
              isUp = true;
            } else {
              isUp = result.data.v[i - 1] < result.data.v[i] ? true : false;
            }
            volObj.push({
              time: result.data.t[i],
              value: result.data.v[i],
              color: isUp ? `rgba(255, 34, 5, 0.8)` : `rgba(64, 88, 221, 0.8)`,
            });
          }
        }
        if (wrapperRef.current) {
          const chart = createChart(wrapperRef.current, {
            width: 800,
            height: 500,
            crosshair: {
              mode: 0,
            },

            timeScale: {
              borderColor: 'rgba(197, 203, 206, 0.8)',
            },
          });
          const chart2 = createChart(wrapperRef.current, {
            width: 800,
            height: 200,
            crosshair: {
              mode: 0,
            },
            timeScale: {
              borderColor: 'rgba(197, 203, 206, 0.8)',
            },
          });

          const volumeSeries = chart.addHistogramSeries({
            title: '거래량',
            priceFormat: {
              type: 'volume',
            },
            priceScaleId: '',
            scaleMargins: {
              top: 0.9,
              bottom: 0,
            },
          });
          const candleSeries = chart.addCandlestickSeries();
          candleSeries.applyOptions({
            upColor: `#ff0000`,
            borderUpColor: `#ff0000`,
            downColor: `#2f00ff`,
            borderDownColor: `#2f00ff`,
            wickColor: `#4b3232`,

            wickUpColor: `#29e06f`,
            wickDownColor: `#d400ff`,
          });
          // candleSeries.priceScale().applyOptions({
          //   mode: 1,
          // });

          candleSeries.setData(chartObj);
          // volumeSeries.setData(volObj);
        }
      })();
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
