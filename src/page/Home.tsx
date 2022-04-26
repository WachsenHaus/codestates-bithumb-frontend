import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { API_BITHUMB_STATUS_CODE } from '../api/bt.api';
import { selectorGetCoinList, atomCoinList } from '../atom/coinList.atom';
import { atomSelectCoinDefault } from '../atom/selectCoinDefault.atom';
import { useNavigate } from 'react-router-dom';

/**
 * URL주소를 분석하고 해당 값으로 defaultCoin을 설정합니다.
 */
// const useGetTradeParam = () => {
//   const params = useParams();
//   const navigate = useNavigate();
//   const coins = useRecoilValue(atomCoinList);
//   const setSelectCoin = useSetRecoilState(atomSelectCoinDefault);

//   useEffect(() => {
//     console.log(params);
//     if (params?.coinName) {
//       const result = params?.coinName?.split('_');
//       if (coins && result) {
//         const item = coins.coinList.find((item) => item.coinSymbol === result[0]);
//         const type = item?.coinType;
//         const siseCrncCd = item?.siseCrncCd;
//         const coinSymbol = item?.coinSymbol;
//         const marketSymbol = result[1];

//         if (type && siseCrncCd && coinSymbol && marketSymbol) {
//           console.log('뭐하냐');
//           setSelectCoin((prevData) => {
//             return {
//               coinType: type,
//               coinSymbol: coinSymbol,
//               marketSymbol: marketSymbol,
//               siseCrncCd: siseCrncCd,
//             };
//           });
//         }
//       }
//     } else {
//       console.log('초기설정함');
//       setSelectCoin({
//         coinType: 'C0101',
//         coinSymbol: 'BTC',
//         marketSymbol: 'KRW',
//         siseCrncCd: 'C0100',
//       });
//       navigate('/BTC_KRW');
//     }
//   }, [coins, params, setSelectCoin]);
// };

const Home = () => {
  return <></>;
};

export default Home;
