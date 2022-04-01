import bmjua from './font/BMJUA_otf.otf';
import bmjuaTTF from './font/BMJUA_ttf.ttf';
import React, { useEffect } from 'react';
import { Grommet, ThemeContext } from 'grommet';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';

import { RecoilRoot, useRecoilState } from 'recoil';
import PathRoutes from './Routes';
import MainPage from './page/MainPage';

const App = () => {
  return (
    <RecoilRoot>
      <Grommet plain>
        <Router>
          <Routes>
            <Route path={PathRoutes.HOME} element={<MainPage />} />
          </Routes>
        </Router>
      </Grommet>
    </RecoilRoot>
  );
};

export default App;
