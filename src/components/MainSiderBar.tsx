import React from 'react';

const MainSiderBar = () => {
  return (
    <div
      className="h-full bg-black"
      style={{
        gridRowStart: 1,
        gridRowEnd: -1,
        gridColumnStart: 2,
        gridColumnEnd: -1,
      }}
    >
      사이드바
    </div>
  );
};
export default MainSiderBar;
