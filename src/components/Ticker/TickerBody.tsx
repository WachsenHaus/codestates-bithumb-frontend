import React, { useCallback, useEffect, useState } from 'react';
import {
  TableCellProps,
  TableHeaderProps,
  TableRowProps,
} from 'react-virtualized';
import { useRecoilState, useRecoilValue } from 'recoil';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarRateIcon from '@mui/icons-material/StarRate';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { TypeDrawTicker } from '../../atom/drawData.atom';
import {
  applyCookie,
  convertStringPriceToKRW,
  convertStringPriceWON,
  getCookie,
  packCookie,
  pushCookie,
  unpackCookie,
} from '../../utils/utils';
import classNames from 'classnames';
import styles from '../../components/animation.module.css';
import { atomPriceInfoUseCoins } from '../../atom/total.atom';
import {
  atomSelectCoinDefault,
  ISelectCoinDefault,
} from '../../atom/selectCoinDefault.atom';
import _ from 'lodash';
import produce from 'immer';
import { Scale } from '@mui/icons-material';

export const RenderFavoriteColumn = (e: TableRowProps) => {
  const [drawTicker, setDrawTicker] = useRecoilState(atomPriceInfoUseCoins);
  // console.log(rowData);

  const onToggleCoin = useCallback(
    (
      drawTicker: Array<TypeDrawTicker>,
      e: {
        rowData: TypeDrawTicker;
      }
    ) => {
      const next = produce(drawTicker, (draft) => {
        for (let i = 0; i < draft.length; i++) {
          if (draft[i].coinSymbol === e.rowData.coinSymbol) {
            draft[i].isFavorite = !draft[i].isFavorite;
          }
        }
      });
      return next;
    },
    []
  );

  const onClick = useCallback(() => {
    const rawCookies = getCookie('marketFavoritesCoin');
    const parsedCookies = unpackCookie(rawCookies);
    const pushedCookies = pushCookie(parsedCookies, e);
    const packedCookies = packCookie(pushedCookies);
    applyCookie(packedCookies);

    setTimeout(() => {
      const coins = onToggleCoin(drawTicker, e);
      setDrawTicker(coins);
    }, 0);
  }, [e.rowData, onToggleCoin]);

  return (
    <div
      onClick={onClick}
      className="flex justify-center items-center h-full hover:cursor-pointer active:bg-yellow-200  hover:scale-110"
      // whileHover={{
      //   scale: 1.1,
      // }}
    >
      {e.rowData.isFavorite ? <StarRateIcon /> : <StarBorderIcon />}
    </div>
  );
};

export const RenderNameColumn = React.memo(
  ({ e, activeIndex }: { e: TableRowProps; activeIndex?: number }) => {
    const navigate = useNavigate();
    const selectCoinDefault = useRecoilValue(atomSelectCoinDefault);

    const onSelectClick = useCallback(
      (e: any) => () => {
        const clickedCoinInfo = e.rowData as ISelectCoinDefault;
        if (clickedCoinInfo === undefined) {
          return;
        }
        if (clickedCoinInfo.coinSymbol === selectCoinDefault.coinSymbol) {
          return;
        }
        const symbol = clickedCoinInfo.coinSymbol;
        const mSymbol = clickedCoinInfo.siseCrncCd === 'C0100' ? 'KRW' : 'BTC';
        if (navigate) {
          navigate && navigate(`/${symbol}_${mSymbol}`);
        }
      },
      [selectCoinDefault]
    );

    return (
      <div
        className={classNames(
          `${
            selectCoinDefault.coinType === e.rowData.coinType && ` text-red-300`
          }`,
          ` flex flex-col justify-center w-full h-full `,
          `hover:scale-110`,
          `hover:ml-4`
        )}
        onClick={onSelectClick(e)}
      >
        {e.rowData.coinName}
        <div className="text-xs font-bmjua">
          {e.rowData.coinSymbol}/{e.rowData.siseCrncCd === 'C0100' ? 'KRW' : ''}
        </div>
      </div>
    );
  }
);

export const RenderCurrentPriceColumn = React.memo((e: TableRowProps) => {
  return (
    <div className="flex items-center">
      <div>
        {convertStringPriceToKRW(e.rowData.e)}
        <div
          className={classNames(
            // `will-change-transform`,
            `${styles.effect}`,
            `border-white`,
            e.rowData.isUp === true && `border-red-600`,
            e.rowData.isUp === false && `border-blue-600`,
            e.rowData?.isUp === undefined && `border-white`,
            `border-2`,
            `h-1`
          )}
        />
      </div>
    </div>
  );
});

export const RenderRateOfChange = React.memo((e: TableRowProps) => {
  const [isUp, setIsUp] = useState(true);
  useEffect(() => {
    if (e.rowData.a?.includes('-')) {
      setIsUp(false);
    } else {
      setIsUp(true);
    }
  }, [e.rowData.a]);
  let price = Number(e.rowData.a).toLocaleString('ko-kr');
  if (isUp) {
    price = `+${price}`;
  } else {
    price = `${price}`;
  }

  return (
    <div
      className={classNames(
        `flex flex-col justify-center items-start`,
        `w-full h-full`,
        `${isUp ? `text-red-500` : `text-blue-500`}`
      )}
    >
      <div className="">{e.rowData.r}%</div>
      <div className="ml-4 text-sm">{price}</div>
    </div>
  );
});

export const RenderU24 = React.memo((e: TableRowProps) => {
  return (
    <div
      className={classNames(
        `flex flex-col items-start justify-center`,
        `w-full h-full`
      )}
    >
      <div className="">{convertStringPriceWON(e.rowData.u24)}</div>
    </div>
  );
});

export const HeaderCoinName = React.memo((e: TableHeaderProps) => {
  return <div className="font-bmjua">자산</div>;
});

export const HeaderPrice = React.memo(
  ({
    e,
    onClick,
    direction,
    arrowActive,
  }: {
    e: TableHeaderProps;
    onClick: () => void;
    direction: 'desc' | 'asc';
    arrowActive: boolean;
  }) => {
    return (
      <div
        className="flex justify-center items-center font-bmjua  cursor-pointer"
        onClick={onClick}
      >
        <div>현재가</div>
        <SortArrow direction={direction} active={arrowActive} />
      </div>
    );
  }
);

export const HeaderRateOfChange = React.memo(
  ({
    e,
    onClick,
    direction,
    arrowActive,
  }: {
    e: TableHeaderProps;
    onClick: () => void;
    direction: 'desc' | 'asc';
    arrowActive: boolean;
  }) => {
    return (
      <div
        className="flex justify-center items-center font-bmjua  cursor-pointer"
        onClick={onClick}
      >
        <div>변동률(당일)</div>
        <SortArrow direction={direction} active={arrowActive} />
      </div>
    );
  }
);

export const HeaderVolume = React.memo(
  ({
    e,
    onClick,
    direction,
    arrowActive,
  }: {
    e: TableHeaderProps;
    onClick: () => void;
    direction: 'desc' | 'asc';
    arrowActive: boolean;
  }) => {
    return (
      <div
        className="flex justify-center items-center font-bmjua  cursor-pointer"
        onClick={onClick}
      >
        <div>거래금액(24H)</div>
        <SortArrow direction={direction} active={arrowActive} />
      </div>
    );
  }
);

const SortArrow = ({
  direction,
  active,
}: {
  direction: 'desc' | 'asc';
  active: boolean;
}) => (
  <div className="flex flex-col justify-center items-center opacity-50">
    <ArrowDropUpIcon
      className={classNames(
        direction === 'asc' && active ? `opacity-100` : 'opacity-50'
      )}
    />
    <ArrowDropDownIcon
      className={classNames(
        direction === 'desc' && active ? `opacity-100` : 'opacity-50'
      )}
    />
  </div>
);
