import React from 'react';

const MainSiderBar = () => {
  return (
    <div
      className="h-full bg-black"
      style={{
        gridRowStart: 1,
        gridRowEnd: -1,
        gridColumn: 2,
      }}
    >
      사이드바
    </div>
  );
};
export default MainSiderBar;
