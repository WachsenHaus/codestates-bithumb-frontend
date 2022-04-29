import classNames from 'classnames';
import React from 'react';
import { useGetChartDatas } from '../../hooks/useGetChartDatas';
import useGenerateChart from '../../hooks/useGenerateChart';
import useParsingAndUpdateWebSocketChart from '../../hooks/useParsingAndUpdateWebSocketChart';

const TvChart = () => {
  useGetChartDatas();
  const [wrapperRef, candleRef] = useGenerateChart();
  useParsingAndUpdateWebSocketChart(candleRef);

  return <div className={classNames(`w-11/12 h-full`)} ref={wrapperRef} />;
};

export default TvChart;
