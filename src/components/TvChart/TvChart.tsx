import { width } from '@mui/material/node_modules/@mui/system';
import classNames from 'classnames';
import produce from 'immer';
import { createChart, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import _ from 'lodash';

import {
  atomDrawStBars,
  atomWsStBar,
  iStBar,
  selectorDrawStBars,
} from '../../atom/tvChart.atom';
import { useGetChartDatas } from '../../hooks/useChart';
import { convertStringPriceToKRW } from '../../utils/utils';

// const CONST_KR_UTC = 9 * 60 * 60 * 1000;

const TvChart = () => {
  useGetChartDatas();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const candleChart = useRef<ISeriesApi<'Candlestick'> | null>();

  // websocket stbar
  const wsStBar = useRecoilValue(atomWsStBar);
  const [currentBar, setCurrentBar] = useState<iStBar | undefined>(undefined);

  // atom
  const [drawStBars, setDrawStBars] = useRecoilState(atomDrawStBars);
  const selectorDrawStbars = useRecoilValueLoadable(selectorDrawStBars);

  useEffect(() => {
    if (wrapperRef.current) {
      const chart = createChart(wrapperRef.current, {
        height: 340,
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

      window.addEventListener('resize', () => {
        if (wrapperRef.current) {
          chart.resize(wrapperRef?.current?.offsetWidth, 340);
        }
      });
      candleChart.current = chart.addCandlestickSeries();
      candleChart.current.applyOptions({
        priceFormat: {
          type: 'custom',
          formatter: (f: any) => {
            return convertStringPriceToKRW(f);
          },
        },
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
    const { state, contents } = selectorDrawStbars;
    if (state === 'hasValue') {
      contents && setDrawStBars(contents);
      setCurrentBar(undefined);
    } else if (state === 'hasError') {
      console.error(state);
    }
  }, [selectorDrawStbars, setDrawStBars]);

  useEffect(() => {
    currentBar && candleChart.current?.update(currentBar);
  }, [currentBar]);

  useEffect(() => {
    candleChart.current?.setData(drawStBars);
  }, [drawStBars]);

  const CONST_KR_UTC = 9 * 60 * 60 * 1000;

  /**
   * websocket에서 들어온 데이터를 curretBar로 파싱해서 가져옴.
   */
  useEffect(() => {
    const result = new Promise<iStBar>((resolve, reject) => {
      if (wsStBar) {
        const { o, t, e } = wsStBar;
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
          const cloneStBar = _.cloneDeep(currentBar);
          if (currentBar) {
            cloneStBar.close = e;
            cloneStBar.high = Math.max(
              Number(cloneStBar?.high),
              Number(e)
            ).toString();
            cloneStBar.low = Math.min(
              Number(cloneStBar?.low),
              Number(e)
            ).toString();
            cloneStBar.open = o;
          }
          resolve(cloneStBar);
        }
      }
    });
    result.then((result) => {
      setCurrentBar(result);
    });
  }, [wsStBar]);

  return <div className={classNames(`w-full h-full`)} ref={wrapperRef} />;
};

export default TvChart;
