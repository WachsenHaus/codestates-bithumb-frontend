/* eslint-disable @typescript-eslint/no-redeclare */
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import produce from 'immer';
import { atomFixSocketsState, atomSocketsState } from '../atom/user.atom';
import CONST from '../const';

type ButtonTypes = 'KRW' | 'BTC' | 'FAVOURITE';

/**
 *
 * @returns 티커가 그려지는 메인 바텀 푸터입니다.
 */
const MainFooter = () => {
  const userSocket = useRecoilValue(atomSocketsState);
  const setSockets = useSetRecoilState(atomSocketsState);

  /**
   * 해당 버튼을 클릭할 경우 type에 따라 웹소켓의 통신방식이 변경되어야겠네요
   */
  const onClick = (type: ButtonTypes) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    switch (type) {
      case 'KRW':
        if (userSocket.filter((item) => item.identifiler === 'ticker').length === 0) {
          console.warn(`Not Exist ${type} Socket`);
          return;
        }
        setSockets(
          produce(userSocket, (draftState) => {
            draftState.forEach((item) => {
              if (item.identifiler === 'ticker') {
                item.senderType.symbols = CONST.ENABLE_KRW_SYMBOL;
              }
            });
          })
        );
        break;
      case 'BTC':
        if (userSocket.filter((item) => item.identifiler === 'ticker').length === 0) {
          console.warn(`Not Exist ${type} Socket`);
          return;
        }
        setSockets(
          produce(userSocket, (draftState) => {
            draftState.forEach((item) => {
              if (item.identifiler === 'ticker') {
                item.senderType.symbols = CONST.ENABLE_BTC_SYMBOL;
              }
            });
          })
        );
        break;
      case 'FAVOURITE':
        // 테스트 코드
        console.log(userSocket);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="h-full bg-black opacity-25"
      style={{
        gridRowStart: 3,
        gridRowEnd: 4,
        gridColumn: 1,
      }}
    >
      <div className="text-3xl text-red-300" onClick={onClick('KRW')}>
        원화 마켓
      </div>
      <div className="text-3xl text-red-300" onClick={onClick('BTC')}>
        BTC 마켓
      </div>
      <div className="text-3xl text-red-300" onClick={onClick('FAVOURITE')}>
        즐겨 찾기
      </div>
    </div>
  );
};
export default MainFooter;
