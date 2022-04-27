import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { RecoilRoot } from 'recoil';
import TradePage from './page/TradePage';
import { StyledEngineProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DebugObserver from './RecoilDebug';

// import { Home } from 'grommet-icons';
// <Route path={`:coinName`} element={<TradePage />} />
const App = () => {
  return (
    <RecoilRoot>
      <DebugObserver />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StyledEngineProvider>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path={`/:coinName`} element={<TradePage />} />
              <Route path={`/`} element={<TradePage />} />
            </Routes>
          </BrowserRouter>
        </StyledEngineProvider>
      </LocalizationProvider>
    </RecoilRoot>
  );
};

export default App;
