import React from 'react';

const MainContent = () => {
  return (
    <div
      className="h-full bg-black  opacity-50"
      style={{
        gridRowStart: 2,
        gridRowEnd: 3,
        gridColumn: 1,
      }}
    >
      본체
    </div>
  );
};
export default MainContent;
