/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
//

const workercode = () => {
  importScripts(
    'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js'
  );
  order = (orderMode, datas, sortDirection) => {
    if (orderMode === 'e') {
      return _.orderBy(datas, [(e) => Number(e.e)], [sortDirection]);
    } else if (orderMode === 'r') {
      return _.orderBy(datas, [(e) => Number(e.r)], [sortDirection]);
    } else {
      return _.orderBy(datas, [(e) => Number(e.u24)], [sortDirection]);
    }
  };

  self.onmessage = function (e) {
    const { data } = e;

    let resultUseCoins;

    if (data.filterMode === 'normal') {
      if (data.filterKeyword === '') {
        resultUseCoins = data.priceInfoUseCoins;
      } else {
        resultUseCoins = data.priceInfoUseCoins.filter(
          (i) => i.consonant?.toLowerCase().indexOf(filterKeyword) !== -1
        );
      }
    } else {
      if (filterKeyword === '') {
        resultUseCoins = data.priceInfoUseCoins.filter(
          (i) => i.isFavorite === true
        );
      } else {
        resultUseCoins = data.priceInfoUseCoins.filter(
          (i) =>
            i.isFavorite === true &&
            i.consonant?.toLowerCase().indexOf(data.filterKeyword) !== -1
        );
      }
    }
    const result = order(
      data.filterOrder,
      resultUseCoins,
      data.filterDirection
    );
    // return result;
    this.self.postMessage(result);
    // const { data } = e;
    // let result;
    // const cloneDrawTransaction = data.drawTransaction;
    // const { m, c, l } = data.websocketTransaction;
    // for (let i = 0; i < l.length; i++) {
    //   const { o, n, p, q, t } = l[i];
    //   let color = '1';
    //   let prevPrice;
    //   const lastItem = cloneDrawTransaction[cloneDrawTransaction.length - 1];
    //   if (lastItem) {
    //     prevPrice = lastItem.contPrice;
    //     if (p === prevPrice) {
    //       color = lastItem.buySellGb;
    //     } else if (p > prevPrice) {
    //       color = '2';
    //     } else {
    //       color = '1';
    //     }
    //   }
    //   result = {
    //     p: p,
    //   };
    //   cloneDrawTransaction.push({
    //     coinType: c, //
    //     contAmt: n, //
    //     crncCd: m, //
    //     buySellGb: color,
    //     contPrice: p, //현재가
    //     contQty: q, // 수량
    //     contDtm: t, //
    //   });
    //   // 트랜잭션은 20개의 데이터만 보관함.
    //   for (let i = 0; i < 20; i++) {
    //     if (cloneDrawTransaction.length > 20) {
    //       cloneDrawTransaction.shift();
    //     }
    //   }
    // }
    // result = {
    //   ...result,
    //   cloneDrawTransaction,
    // };
    // this.self.postMessage(result);
  };
};

let code = workercode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], { type: 'application/javascript' });
const worker_script = URL.createObjectURL(blob);

export default worker_script;
