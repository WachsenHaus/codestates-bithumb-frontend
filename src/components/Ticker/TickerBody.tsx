import React, { useCallback, useEffect, useState } from 'react';
import { TableCellProps, TableHeaderProps } from 'react-virtualized';
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

export const RenderFavoriteColumn = React.memo((e: TableCellProps) => {
  const [drawTicker, setDrawTicker] = useRecoilState(atomPriceInfoUseCoins);

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
  }, [drawTicker, e, onToggleCoin, setDrawTicker]);

  return (
    <motion.div
      onClick={onClick}
      className="flex justify-center items-center h-full hover:cursor-pointer active:bg-yellow-200 "
      whileHover={{
        scale: 1.1,
      }}
    >
      {e.rowData.isFavorite ? <StarRateIcon /> : <StarBorderIcon />}
    </motion.div>
  );
});

export const RenderNameColumn = React.memo(
  ({ e, activeIndex }: { e: TableCellProps; activeIndex?: number }) => {
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
      <motion.div
        whileTap={{}}
        // whileHover={{
        //   marginLeft: '1rem',
        //   scale: 1.1,
        // }}
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
        {e.cellData}
        <div className="text-xs font-bmjua">
          {e.rowData.coinSymbol}/{e.rowData.siseCrncCd === 'C0100' ? 'KRW' : ''}
        </div>
      </motion.div>
    );
  }
);

export const RenderCurrentPriceColumn = React.memo((e: TableCellProps) => {
  return (
    <motion.div className="flex items-center">
      <div>
        {convertStringPriceToKRW(e.cellData)}
        <AnimatePresence>
          {e.rowData.isUp && (
            <motion.div
              className={classNames(
                `${styles.upEffect}`,
                `border-2 border-white`,
                `h-1`
              )}
            />
          )}
          {e.rowData.isUp === false && (
            <motion.div
              className={classNames(
                `${styles.downEffect}`,
                `border-2 border-white`,
                `h-1`
              )}
            />
          )}
          {e.rowData.isUp === undefined && (
            <motion.div
              className={classNames(`border-2 border-white`, `h-1`)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

export const RenderRateOfChange = React.memo((e: TableCellProps) => {
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
    <motion.div
      className={classNames(
        `flex flex-col justify-center items-start`,
        `w-full h-full`,
        `${isUp ? `text-red-500` : `text-blue-500`}`
      )}
    >
      <motion.div className="">{e.cellData}%</motion.div>
      <motion.div className="ml-4 text-sm">{price}</motion.div>
    </motion.div>
  );
});

export const RenderU24 = React.memo((e: TableCellProps) => {
  return (
    <motion.div
      className={classNames(
        `flex flex-col items-start justify-center`,
        `w-full h-full`
      )}
    >
      <motion.div className="">{convertStringPriceWON(e.cellData)}</motion.div>
    </motion.div>
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
