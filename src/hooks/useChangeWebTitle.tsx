import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { tickerReceiveState } from '../atom/user.atom';

const useChangeWebTitle = () => {
  const rcvTicker = useRecoilValue(tickerReceiveState);

  useEffect(() => {
    const htmlTitle = document.querySelector('title');
    const title = `${Number(rcvTicker.content.openPrice).toLocaleString(
      'ko-kr'
    )} / ${rcvTicker.content.symbol}`;
    if (htmlTitle) {
      htmlTitle.innerHTML = title;
    }
  }, [rcvTicker]);
};

export default useChangeWebTitle;
