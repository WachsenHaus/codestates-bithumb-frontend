/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
//

self.onmessage = function (e) {
  const { data } = e;
  const ticker = data.tickerObj;
  const coinList = data.coins;

  let draft;

  const isExist = coinList.findIndex((item: any) => item.coinType === ticker.c);
  if (isExist === -1) {
    return;
  } else if (ticker.m === 'C0101') {
    return;
  } else {
    draft = coinList;
    let isUp;
    const currentPrice = Number(ticker.e);
    const prevPrice = Number(draft[isExist].e);
    if (currentPrice > prevPrice) {
      isUp = true;
    } else if (currentPrice === prevPrice) {
      isUp = undefined;
    } else {
      isUp = false;
    }
    draft[isExist] = { ...draft[isExist], ...ticker, isUp };
  }

  self.postMessage(draft);
  // result = null;
  // resultUseCoins = null;
};
export {};
// let code = workercode.toString();
// code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

// const blob = new Blob([code], { type: 'application/javascript' });
// const worker_script = URL.createObjectURL(blob);

// export default worker_script;
