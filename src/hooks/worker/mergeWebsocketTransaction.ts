/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

// getRateOfChange
const getRateOfChange = (f: string | undefined, e: string) => {
  if (f === undefined || f === '' || e === '') {
    return;
  }
  const basePrice = Number(f);
  const currentPrice = Number(e);
  const r = (currentPrice * 100) / basePrice - 100;
  if (r === 0) {
    console.log(r);
    return r.toFixed(2).toString();
  } else if (r.toFixed(2).toString().includes('-')) {
    return r.toFixed(2).toString();
  } else {
    return `+${r.toFixed(2).toString()}`;
  }
};

self.onmessage = function (e) {
  const { data } = e;
  let result;
  const cloneDrawTransaction = data.drawTransaction;
  const { m, c, l } = data.websocketTransaction;
  const detail = data.selectDetailCoin;
  for (let i = 0; i < l.length; i++) {
    const { o, n, p, q, t } = l[i];
    let color = '1';
    let prevPrice;
    const lastItem = cloneDrawTransaction[cloneDrawTransaction.length - 1];
    if (lastItem) {
      prevPrice = lastItem.contPrice;
      if (p === prevPrice) {
        color = lastItem.buySellGb;
      } else if (p > prevPrice) {
        color = '2';
      } else {
        color = '1';
      }
    }
    const r = getRateOfChange(detail.f, p);
    result = {
      p: p,
      r: r,
    };
    cloneDrawTransaction.push({
      coinType: c, //
      contAmt: n, //
      crncCd: m, //
      buySellGb: color,
      contPrice: p, //현재가
      contQty: q, // 수량
      contDtm: t, //
    });

    // 트랜잭션은 20개의 데이터만 보관함.
    for (let i = 0; i < 20; i++) {
      if (cloneDrawTransaction.length > 20) {
        cloneDrawTransaction.shift();
      }
    }
  }
  result = {
    ...result,
    cloneDrawTransaction,
  };

  self.postMessage(result);
  result = undefined;
};
export {};
