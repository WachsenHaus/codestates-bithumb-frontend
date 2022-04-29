/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
import _ from 'lodash';

self.onmessage = function (e) {
  const { data } = e;
  const ticker = data.tickerObj;
  const coinList = data.coins;
  const detail = data.detail;
  const defaultCoin = data.default;

  let draft;

  // console.log(item.coinType === ticker.c ,item.coinType === defaultCoin.coinType )
  const isExist = _.findIndex(coinList, (item: any) => {
    if (item.coinType === defaultCoin.coinType) {
      console.log(item);
    }
    return item.coinType === ticker.c || item.coinType === defaultCoin.coinType;
  });
  // const isExist = coinList.findIndex();
  if (isExist === -1) {
    return;
  } else if (ticker.m === 'C0101') {
    return;
  } else {
    // coinList;
    let isUp;
    const currentPrice = Number(ticker.e) || Number(detail.e);
    const prevPrice = Number(coinList[isExist].e);
    if (currentPrice > prevPrice) {
      isUp = true;
    } else if (currentPrice === prevPrice) {
      isUp = undefined;
    } else {
      isUp = false;
    }
    // console.log(detail);
    if (coinList[isExist].coinType === defaultCoin.coinType) {
      // console.log(detail);
      // const a = (detail.e * detail.r) / 100;
      // console.log(a.toString());
      // console.log(coinList[isExist]);
      coinList[isExist] = { ...coinList[isExist], e: detail.e, r: detail.r, isUp };
    } else if (coinList[isExist].coinType === ticker.c) {
      coinList[isExist] = { ...coinList[isExist], ...ticker, isUp };
    }
    self.postMessage(coinList);
  }
};
export {};
