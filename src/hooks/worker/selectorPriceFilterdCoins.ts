/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
//

import { TypeDrawTicker } from '../../atom/drawData.atom';

const workercode = () => {
  // importScripts(
  //   'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js'
  // );
};

const order = (
  orderMode: 'e' | 'r' | 'u24',
  datas: TypeDrawTicker[],
  sortDirection: 'desc' | 'asc'
) => {
  // console.log(datas);
  if (orderMode === 'e') {
    return datas.sort((a, b) => {
      const current = Number(a.e);
      const next = Number(b.e);
      if (sortDirection === 'asc') {
        return current < next ? -1 : current > next ? 1 : 0;
      } else {
        return current > next ? -1 : current < next ? 1 : 0;
      }
    });
    // return _.orderBy(datas, [(e) => Number(e.e)], [sortDirection]);
  } else if (orderMode === 'r') {
    // return _.orderBy(datas, [(e) => Number(e.r)], [sortDirection]);
    return datas.sort((a, b) => {
      const current = Number(a.r);
      const next = Number(b.r);
      if (sortDirection === 'asc') {
        return current < next ? -1 : current > next ? 1 : 0;
      } else {
        return current > next ? -1 : current < next ? 1 : 0;
      }
    });
  } else {
    // return _.orderBy(datas, [(e) => Number(e.u24)], [sortDirection]);
    return datas.sort((a, b) => {
      const current = Number(a.u24);
      const next = Number(b.u24);
      if (sortDirection === 'asc') {
        return current < next ? -1 : current > next ? 1 : 0;
      } else {
        return current > next ? -1 : current < next ? 1 : 0;
      }
    });
  }
};

self.onmessage = function (e) {
  const { data }: { data: any } = e;
  let resultUseCoins;

  if (data.filterMode === 'normal') {
    if (data.filterKeyword === '') {
      resultUseCoins = data.priceInfoUseCoins;
    } else {
      resultUseCoins = data.priceInfoUseCoins.filter(
        (i: any) =>
          i.consonant?.toLowerCase().indexOf(data.filterKeyword) !== -1
      );
    }
  } else {
    if (data.filterKeyword === '') {
      resultUseCoins = data.priceInfoUseCoins.filter(
        (i: any) => i.isFavorite === true
      );
    } else {
      resultUseCoins = data.priceInfoUseCoins.filter(
        (i: any) =>
          i.isFavorite === true &&
          i.consonant?.toLowerCase().indexOf(data.filterKeyword) !== -1
      );
    }
  }
  let result = order(data.filterOrder, resultUseCoins, data.filterDirection);

  self.postMessage(result);
  // result = null;
  // resultUseCoins = null;
};

export default workercode;

// let code = workercode.toString();
// code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

// const blob = new Blob([code], { type: 'application/javascript' });
// const worker_script = URL.createObjectURL(blob);

// export default worker_script;
