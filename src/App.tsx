import React, { ReactNode, useEffect } from 'react';
import qs from 'qs';
import bmjua from './font/BMJUA_otf.otf';
import bmjuaTTF from './font/BMJUA_ttf.ttf';
import { Grommet, ThemeContext } from 'grommet';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';

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
      <DebugObserver />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StyledEngineProvider>
          <CssBaseline />
          <Grommet plain>
            <Router>
              <Routes>
                <Route path={PathRoutes.HOME} element={<MainPage />} />
              </Routes>
            </Router>
          </Grommet>
        </StyledEngineProvider>
      </LocalizationProvider>
    </RecoilRoot>
  );
};

export default App;
