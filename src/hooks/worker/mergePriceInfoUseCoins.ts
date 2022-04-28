/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
import _ from 'lodash';

self.onmessage = function (e) {
  const { data } = e;
  const ticker = data.tickerObj;
  const coinList = data.coins;

  let draft;

  const isExist = _.findIndex(
    coinList,
    (item: any) => item.coinType === ticker.c
  );
  // const isExist = coinList.findIndex();
  if (isExist === -1) {
    return;
  } else if (ticker.m === 'C0101') {
    return;
  } else {
    draft = coinList;
    let isUp;
    const currentPrice = Number(ticker.e);
    const prevPrice = Number(coinList[isExist].e);
    if (currentPrice > prevPrice) {
      isUp = true;
    } else if (currentPrice === prevPrice) {
      isUp = undefined;
    } else {
      isUp = false;
    }

    coinList[isExist] = { ...coinList[isExist], ...ticker, isUp };
  }

  self.postMessage(draft);
};
export {};
