import React, { useEffect } from 'react';
import { Grommet } from 'grommet';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { RecoilRoot } from 'recoil';
import PathRoutes from './Routes';
import TradePage from './page/TradePage';
import { StyledEngineProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DebugObserver from './RecoilDebug';
import Home from './page/Home';

// import { Home } from 'grommet-icons';
// <Route path={`:coinName`} element={<TradePage />} />
const App = () => {
  return (
    <RecoilRoot>
      {/* <DebugObserver /> */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StyledEngineProvider>
          <CssBaseline />
          <Grommet plain>
            <BrowserRouter>
              <Routes>
                <Route path={`/`} element={<TradePage />} />
                <Route path={`/:coinName`} element={<TradePage />} />
              </Routes>
            </BrowserRouter>
          </Grommet>
        </StyledEngineProvider>
      </LocalizationProvider>
    </RecoilRoot>
  );
};

export default App;
