import classNames from 'classnames';
import produce from 'immer';
import { createChart, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  atomChartData,
  atomGetStChartData,
  TypeChartData,
} from '../../atom/tvChart.atom';
import { useGetChartDatas } from '../../hooks/useChart';

const CONST_KR_UTC = 9 * 60 * 60 * 1000;

const TvChart = () => {
  useGetChartDatas();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const candleChart = useRef<ISeriesApi<'Candlestick'> | null>();
  const chartData = useRecoilValue(atomChartData);

  const [stObj, setStObj] = useRecoilState(atomGetStChartData);
  const [chartObj, setChartObj] = useState<Array<TypeChartData>>([]);

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
      const lastIndex = chartObj.length - 1;
      const currentTime = moment(t, 'YYYYMMDDHHmmss')
        .utc()
        .valueOf() as UTCTimestamp;
      const int = ((((currentTime + CONST_KR_UTC) / 1000 / 60) | 0) *
        60) as UTCTimestamp;

      const nextTime = int;
      if (currentBar === undefined) {
        setCurrentBar({
          close: e,
          high: e,
          low: e,
          open: e,
          time: nextTime,
        });
      } else if (currentBar?.open !== null) {
        const next = produce(currentBar, (draft) => {
          if (draft) {
            draft.close = e;
            // draft.time = int;
            draft.high = Math.max(Number(draft?.high), Number(e)).toString();
            // draft.high = h;
            draft.low = Math.min(Number(draft?.low), Number(e)).toString();
            // draft.low = l;
            draft.open = o;
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

    const result = new Promise<Array<TypeChartData>>((resolve, reject) => {
      let obj = [];
      for (let i = 0; i < idx; i++) {
        // const time = moment(t[i] / 1000)
        //   .utc()
        //   .valueOf() as UTCTimestamp;
        const time = ((t[i] + CONST_KR_UTC) / 1000) as UTCTimestamp;
        obj.push({
          time: time,
          open: o[i],
          high: h[i],
          low: l[i],
          close: c[i],
        });
      }
      resolve(obj);
    });
    result.then((d) => {
      setCurrentBar(undefined);
      setChartObj(d);
    });
  }, [chartData]);

  useEffect(() => {
    if (chartObj.length > 0) {
      candleChart.current?.setData(chartObj);
    }
  }, [chartObj]);

  return <div className={classNames(`w-full h-full`)} ref={wrapperRef} />;
};

export default TvChart;
