import classNames from 'classnames';
import produce from 'immer';
import { createChart, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { atomDrawChart } from '../../atom/drawData.atom';
import { atomSelectCoin } from '../../atom/selectCoin.atom';
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

  const stObj = useRecoilValue(atomGetStChartData);
  const [drawChart, setDrawChart] = useRecoilState(atomDrawChart);

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

  /**
   * 웹소켓으로 st 객체가 들어오면 일봉스틱으로 변경함.
   */
  useEffect(() => {
    if (stObj) {
      const { o, t, e } = stObj;
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
            draft.high = Math.max(Number(draft?.high), Number(e)).toString();
            draft.low = Math.min(Number(draft?.low), Number(e)).toString();
            draft.open = o;
          }
        });
        setCurrentBar(next);
      }
    }
  }, [stObj]);

  /**
   * 현재 스틱이 수정되면 그래프에 업데이트를 적용함
   */
  useEffect(() => {
    if (currentBar) {
      candleChart.current?.update(currentBar);
    }
  }, [currentBar]);

  /**
   * 차트원본이 수정되면 그리는 차트데이터로 수정함.
   */
  useEffect(() => {
    const { c, h, l, o, t, v } = chartData;
    const result = new Promise<Array<TypeChartData>>((resolve, reject) => {
      let obj = [];
      for (let i = 0; i < t.length; i++) {
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
      setDrawChart(d);
    });
  }, [chartData]);

  /**
   * 그리는 차트 값이 변경되면 그래프에 적용함.
   */
  useEffect(() => {
    if (drawChart.length > 0) {
      candleChart.current?.setData(drawChart);
    }
  }, [drawChart]);

  return <div className={classNames(`w-full h-full`)} ref={wrapperRef} />;
};

export default TvChart;
