import _ from 'lodash';
import { TypeDrawTicker } from '../atom/drawData.atom';
import hangul from 'hangul-js';

/**
 *
 * @param value 문자열 숫자
 * @returns 한국식 숫자를 표기해줌. value가 없으면 빈 문자열
 */
export const convertStringPriceToKRW = (value?: string) => {
  const nValue = Number(value);
  if (value === undefined || value?.length === 0) {
    return '';
  } else if (nValue < 1) {
    return nValue.toFixed(4);
  } else if (nValue < 10) {
    return nValue.toFixed(3);
  } else if (nValue < 100) {
    return nValue.toFixed(2);
  } else if (nValue < 1000) {
    return nValue.toFixed(1);
  } else {
    return nValue.toLocaleString('ko-kr');
  }
};

const CONST_DIVIDE_WON_MILLION = 8;
export const convertStringPriceWON = (value?: string) => {
  if (value) {
    const numberValue = Number(value);
    let price;
    if (value.length < CONST_DIVIDE_WON_MILLION) {
      price = (numberValue / 1000) | 0;
      price = `${price.toLocaleString('ko-kr')}천`;
    } else {
      price = (numberValue / 1000 / 1000) | 0;
      price = `${price.toLocaleString('ko-kr')}백만`;
    }
    return price;
  } else {
    return undefined;
  }
};

/**
 *
 * @param value 24시간 볼륨을 인자로받음
 * @returns 소숫점 4자리까지 반올림하여 반환함.
 */
export const convertStringToVolume24 = (value?: string) =>
  value ? Number(value).toFixed(4) : '';

export type TypeMarketFavoritesCoin = 'marketFavoritesCoin';

export const setCookie = (
  name: TypeMarketFavoritesCoin,
  value: string,
  exp: number
) => {
  let date = new Date();
  date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
  // console.log()
  const eValue = encodeURI(value);
  document.cookie =
    name + '=' + eValue + ';expires=' + date.toUTCString() + ';path=/';
};

export const getCookie = (name: TypeMarketFavoritesCoin) => {
  const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  // const result = ;
  return value ? decodeURI(value[2]) : '';
};

/**
 *
 * @param cookie
 * @returns
 */
export const unpackCookie = (cookie: string) => {
  return cookie.replace('[', '').replace(']', '').replace(/\"/g, '').split(',');
};

export const pushCookie = (
  cookies: string[],
  e: {
    rowData: TypeDrawTicker;
  }
) => {
  const selectCoinName = `${e.rowData.coinType}_${e.rowData.m}`;
  if (cookies?.length === 1 && cookies[0] === '') {
    cookies = [selectCoinName];
  } else {
    const isExist = cookies.findIndex(
      (cookieName) => cookieName === selectCoinName
    );
    if (isExist !== -1) {
      cookies.splice(isExist, 1);
    } else {
      cookies.push(`${selectCoinName}`);
    }
  }
  return cookies;
};

export const packCookie = (cookieStr: string[]) => {
  const result = cookieStr.map((item) => {
    return `"${item}"`;
  });
  return `[${[result]}]`;
};

export const applyCookie = (cookie: any, day: number = 1) => {
  setCookie('marketFavoritesCoin', cookie, day);
};

/**
 *
 * @param orderMode
 * @param datas
 * @param sortDirection
 * @returns 정렬 함수
 */
export const order = (
  orderMode: 'e' | 'r' | 'u24',
  datas: TypeDrawTicker[],
  sortDirection: 'asc' | 'desc'
) => {
  if (orderMode === 'e') {
    return _.orderBy(datas, [(e) => Number(e.e)], [sortDirection]);
  } else if (orderMode === 'r') {
    return _.orderBy(datas, [(e) => Number(e.r)], [sortDirection]);
  } else {
    return _.orderBy(datas, [(e) => Number(e.u24)], [sortDirection]);
  }
};

/**
 *
 * @param param0
 * @returns 한글자음,한글이름,영어이름을 반환합니다.
 */
export const getConsonant = ({
  coinName,
  coinNameEn,
  coinSymbol,
}: {
  coinName: string;
  coinNameEn: string;
  coinSymbol: string;
}) => {
  const result = hangul.d(coinName, true);
  if (result) {
    let data = '';
    for (let i = 0; i < result.length; i++) {
      data = data + result[i][0];
    }
    data.replace(' ', '');
    data += coinNameEn;
    data += coinSymbol;
    data += coinName;
    return data;
  }
};
