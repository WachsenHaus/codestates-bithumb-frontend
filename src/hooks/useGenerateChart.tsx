import { ISeriesApi, IChartApi, createChart } from 'lightweight-charts';
import { useCallback, useEffect, useRef } from 'react';
import { convertStringPriceToKRW } from '../utils/utils';

const useGenerateChart = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const candleChart = useRef<ISeriesApi<'Candlestick'> | null>();
  const chartRef = useRef<IChartApi | null | undefined>();

  const onResize = useCallback(
    (chart: React.MutableRefObject<IChartApi | null | undefined>, ref: React.MutableRefObject<HTMLDivElement | null>) => () => {
      chart.current && ref.current && chart.current.resize(ref?.current?.offsetWidth, 340);
    },
    []
  );

  useEffect(() => {
    if (wrapperRef.current) {
      chartRef.current = createChart(wrapperRef.current, {
        height: 340,
        crosshair: {
          mode: 0,
        },

        timeScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)',
        },
      });

      chartRef.current.applyOptions({
        timeScale: {
          timeVisible: true,
        },
      });

      window.addEventListener('resize', onResize(chartRef, wrapperRef));
      candleChart.current = chartRef.current.addCandlestickSeries();
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

  return [wrapperRef, candleChart] as const;
};

export default useGenerateChart;
