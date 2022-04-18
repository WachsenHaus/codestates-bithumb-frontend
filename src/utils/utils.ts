import { useEffect } from 'react';
/* eslint-disable no-extend-native */
import React from 'react';

/**
 *
 * @param value 문자열 숫자
 * @returns 한국식 숫자를 표기해줌. value가 없으면 빈 문자열
 */
export const ConvertStringPriceToKRW = (value?: string) =>
  value ? Number(value).toLocaleString('ko-kr') : '';

/**
 *
 * @param value 24시간 볼륨을 인자로받음
 * @returns 소숫점 4자리까지 반올림하여 반환함.
 */
export const ConvertStringToVolume24 = (value?: string) =>
  value ? Number(value).toFixed(4) : '';
