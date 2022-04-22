import { useEffect } from 'react';
/* eslint-disable no-extend-native */
import React from 'react';
import { TypeDrawTicker } from '../atom/drawData.atom';

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
      price = `${price.toLocaleString('ko-kr')}천원`;
    } else {
      price = (numberValue / 1000 / 1000) | 0;
      price = `${price.toLocaleString('ko-kr')}백만원`;
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
