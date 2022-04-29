import React, { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { atomSelectChartSetup, ISelectChartSetup } from '../../atom/selectChart.atom';
import TvListItem from './TvListItem';

const TvChartTime = () => {
  const setSelectChartSetup = useSetRecoilState(atomSelectChartSetup);

  const onClick = useCallback(
    (time: ISelectChartSetup) => () => {
      setSelectChartSetup({ chartTime: time.chartTime });
    },
    []
  );

  return (
    <ul className="w-1/12 px-2 -ml-2">
      <TvListItem onClick={onClick({ chartTime: '1M' })}>1분</TvListItem>
      <TvListItem onClick={onClick({ chartTime: '10M' })}>10분</TvListItem>
      <TvListItem onClick={onClick({ chartTime: '30M' })}>30분</TvListItem>
      <TvListItem onClick={onClick({ chartTime: '1H' })}>1시간</TvListItem>
    </ul>
  );
};

export default TvChartTime;
