import React, { useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { atomSelectChartSetup } from '../atom/selectChart.atom';
import TvChart from './TvChart/TvChart';
import TvChartTime from './TvChart/TvChartTime';

const MainContent = () => {
  return (
    <div className="opacity-90 flex ">
      <TvChart />
      <TvChartTime />
    </div>
  );
};
export default MainContent;
