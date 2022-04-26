import React from 'react';
import { Grommet } from 'grommet';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { RecoilRoot } from 'recoil';
import PathRoutes from './Routes';
import MainPage from './page/MainPage';
import { StyledEngineProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DebugObserver from './RecoilDebug';

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
                <Route path={`${PathRoutes.HOME}`} element={<MainPage />}>
                  <Route path={`:coinName`} element={<MainPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </Grommet>
        </StyledEngineProvider>
      </LocalizationProvider>
    </RecoilRoot>
  );
};

export default App;
