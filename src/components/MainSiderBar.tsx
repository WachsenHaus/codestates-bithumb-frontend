import { Box } from 'grommet';
import React from 'react';

const MainSiderBar = () => {
  return (
    <div
      className="h-full "
      style={{
        gridRowStart: 1,
        gridRowEnd: -1,
        gridColumnStart: 2,
        gridColumnEnd: -1,
      }}
    >
      <Box background={'light-5'}>사이드바</Box>
    </div>
  );
};
export default MainSiderBar;
