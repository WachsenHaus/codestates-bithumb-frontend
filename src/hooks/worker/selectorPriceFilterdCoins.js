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
          (i) => i.consonant?.toLowerCase().indexOf(data.filterKeyword) !== -1
        );
      }
    } else {
      if (data.filterKeyword === '') {
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
    let result = order(data.filterOrder, resultUseCoins, data.filterDirection);

    this.self.postMessage(result);
    result = null;
    resultUseCoins = null;
  };
};

let code = workercode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], { type: 'application/javascript' });
const worker_script = URL.createObjectURL(blob);

export default worker_script;
