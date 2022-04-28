/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

self.onmessage = function (e) {
  const { data } = e;
  let result;
  const cloneDrawTransaction = data.drawTransaction;
  const { m, c, l } = data.websocketTransaction;
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
    result = {
      p: p,
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
// let code = workercode.toString();
// code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

// const blob = new Blob([code], { type: 'application/javascript' });
// const worker_script = URL.createObjectURL(blob);

// export default worker_script;
