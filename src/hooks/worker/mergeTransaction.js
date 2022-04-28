/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
// import React from 'react';
// import produce from 'immer';
// import _ from 'lodash';
// importScripts('../dist/lodash.js');
// importScripts('https://unpkg.com/immer@3.2.0/dist/immer.umd.js');

const workercode = () => {
  self.onmessage = function (e) {
    // self.importScripts("./testModule"); // eslint-disable-line no-restricted-globals
    // eslint-disable-line no-restricted-globals

    const { data } = e;
    // console.log('Message received from main script');
    // setTimeout(() => {
    //   var workerResult = 'Received from main: ' + e.data;
    //   console.log('Posting message back to main script');
    //   // self.postMessage(api.message()); // eslint-disable-line no-restricted-globals
    //   self.postMessage(e.data); // eslint-disable-line no-restricted-globals
    // }, 3000);

    let result;
    const cloneDrawTransaction = JSON.parse(JSON.stringify(data.drawTransaction));
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

    // const next = produce(data.drawTransaction, (draft) => {
    //   if (data.drawTransaction === undefined) {
    //     return;
    //   }
    //   const { m, c, l } = data.websocketTransaction;
    //   for (let i = 0; i < l.length; i++) {
    //     const { o, n, p, q, t } = l[i];
    //     let color = '1';
    //     let prevPrice;
    //     const lastItem = draft[draft.length - 1];
    //     if (lastItem) {
    //       prevPrice = lastItem.contPrice;
    //       if (p === prevPrice) {
    //         color = lastItem.buySellGb;
    //       } else if (p > prevPrice) {
    //         color = '2';
    //       } else {
    //         color = '1';
    //       }
    //     }
    //     result = {
    //       p: p,
    //     };
    //     draft.push({
    //       coinType: c, //
    //       contAmt: n, //
    //       crncCd: m, //
    //       buySellGb: color,
    //       contPrice: p, //현재가
    //       contQty: q, // 수량
    //       contDtm: t, //
    //     });

    //     // 트랜잭션은 20개의 데이터만 보관함.
    //     for (let i = 0; i < 20; i++) {
    //       if (draft.length > 20) {
    //         draft.shift();
    //       }
    //     }
    //   }
    // });
    // result = {
    //   ...result,
    //   next,
    // };

    this.self.postMessage(result);
  };
};

let code = workercode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], { type: 'application/javascript' });
const worker_script = URL.createObjectURL(blob);

export default worker_script;
// module.exports = worker_script;
