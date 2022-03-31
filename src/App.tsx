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
        <ThemeContext.Extend
          value={{
            global: {
              text: '#000000',
              colors: { doc: '#ff99cc', text: '#000000' },
            },
          }}
        >
          <Router>
            <Routes>
              <Route path={PathRoutes.HOME} element={<MainPage />} />
            </Routes>
          </Router>
        </ThemeContext.Extend>
      </Grommet>
    </RecoilRoot>
  );
};

export default App;
