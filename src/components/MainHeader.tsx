import React from 'react';

const MainHeader = () => {
  return (
    <div
      className="h-full bg-black  opacity-5"
      style={{
        gridRowStart: 1,
        gridRowEnd: 2,
        gridColumn: 1,
      }}
    >
      헤더
    </div>
  );
};
export default MainHeader;
