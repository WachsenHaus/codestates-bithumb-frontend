import React, { useEffect } from 'react';
import { Grommet } from 'grommet';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { RecoilRoot, useRecoilState } from 'recoil';
import { useConnectBitThumb } from './hooks/useWebSocket';
import { tickerState } from './atom/ticker.atom';
import PathRoutes from './Routes';
import MainPage from './page/MainPage';

const App = () => {
  return (
    <RecoilRoot>
      <Grommet plain>
        <Router>
          <div>
            <Routes>
              <Route path={PathRoutes.HOME} element={<MainPage />} />
            </Routes>
          </div>
        </Router>
      </Grommet>
    </RecoilRoot>
  );
};

export default App;
