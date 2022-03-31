import React, { useEffect } from 'react';
import { Grommet } from 'grommet';
import { useConnectBitThumb } from './hooks/useWebSocket';

const App = () => {
  const bitThumbWs = useConnectBitThumb();
  /**
   * 테스트 웹소켓
   */

  //https://apidocs.bithumb.com/docs/websocket_public
  useEffect(() => {}, []);
  return (
    <Grommet plain>
      <h1 className="text-3xl text-red-300">안녕하세요</h1>
      <div
        onClick={() => {
          console.log('?');
          if (bitThumbWs) {
            bitThumbWs.onmessage = (evt: MessageEvent) => {
              console.log(evt);
              console.log(evt.data);
            };
          }
        }}
        className="text-3xl text-red-300"
      >
        안녕하세요
      </div>
    </Grommet>
  );
};
export default App;
