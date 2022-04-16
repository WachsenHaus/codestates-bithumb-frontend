import classNames from 'classnames';
import produce from 'immer';
import { createChart, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { atomChartData, atomGetStChartData } from '../../atom/tvChart.atom';
import { useGetChartDatas } from '../../hooks/useChart';

const CONST_KR_UTC = 9 * 60 * 60 * 1000;

const TvChart = () => {
  useGetChartDatas();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const candleChart = useRef<ISeriesApi<'Candlestick'> | null>();
  const chartData = useRecoilValue(atomChartData);

  const [stObj, setStObj] = useRecoilState(atomGetStChartData);
  const [chartObj, setChartObj] = useState<
    {
      time: UTCTimestamp;
      open: string;
      high: string;
      low: string;
      close: string;
    }[]
  >([]);

  const [currentBar, setCurrentBar] = useState<{
    time: UTCTimestamp;
    open: string;
    high: string;
    low: string;
    close: string;
  }>();

  useEffect(() => {
    if (wrapperRef.current) {
      const chart = createChart(wrapperRef.current, {
        height: 400,
        crosshair: {
          mode: 0,
        },

        timeScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)',
        },
      });
      chart.applyOptions({
        timeScale: {
          timeVisible: true,
        },
      });
      candleChart.current = chart.addCandlestickSeries();
      candleChart.current.applyOptions({
        upColor: `#ff0000`,
        borderUpColor: `#ff0000`,
        downColor: `#2f00ff`,
        borderDownColor: `#2f00ff`,
        wickColor: `#4b3232`,

        wickUpColor: `#29e06f`,
        wickDownColor: `#d400ff`,
      });
    }

    return () => {
      wrapperRef.current = null;
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (stObj) {
      const { c, h, l, o, t, e } = stObj;
      console.log(stObj);
      const time = ((moment(t, 'YYYYMMDDHHmmss').utc().valueOf() +
        CONST_KR_UTC) /
        1000) as UTCTimestamp;

      const lastIndex = chartObj.length - 1;
      const lastData = chartObj[lastIndex];
      if (currentBar === undefined) {
        setCurrentBar({
          close: e,
          high: e,
          low: e,
          open: e,
          time: lastData.time,
        });
      } else if (currentBar?.open !== null) {
        const next = produce(currentBar, (draft) => {
          if (draft) {
            draft.close = e;
            draft.high = Math.max(Number(draft?.high), Number(e)).toString();
            draft.low = Math.max(Number(draft?.low), Number(e)).toString();
          }
        });
        setCurrentBar(next);
      }
    }
  }, [stObj]);

  useEffect(() => {
    if (currentBar) {
      candleChart.current?.update(currentBar);
    }
  }, [currentBar]);

  useEffect(() => {
    const { c, h, l, o, t, v } = chartData;
    const idx = t.length ? t.length : 0;
    let obj = [];

    for (let i = 0; i < idx; i++) {
      const time = ((t[i] + CONST_KR_UTC) / 1000) as UTCTimestamp;
      obj.push({
        time: time,
        open: o[i],
        high: h[i],
        low: l[i],
        close: c[i],
      });
    }
    setChartObj(obj);
    setCurrentBar(undefined);
  }, [chartData]);

  useEffect(() => {
    if (chartObj.length > 0) {
      candleChart.current?.setData(chartObj);
    }
  }, [chartObj]);

  return <div className={classNames(`w-full h-full`)} ref={wrapperRef} />;
};

export default TvChart;
