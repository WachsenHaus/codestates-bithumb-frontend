import React, { useEffect, useState } from 'react';
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
import _, { find } from 'lodash';

export const RenderFavoriteColumn = (e: TableCellProps) => {
  const [drawTicker, setDrawTicker] = useRecoilState(atomPriceInfoUseCoins);

  const onToggleCoin = async (
    drawTicker: Array<TypeDrawTicker>,
    e: {
      rowData: TypeDrawTicker;
    }
  ) => {
    const cloneDrawTicker = _.cloneDeep(drawTicker);
    const findItem = cloneDrawTicker.find(
      (item) => item.coinSymbol === e.rowData.coinSymbol
    );
    if (findItem) {
      findItem.isFavorite = !findItem.isFavorite;
    }
    return cloneDrawTicker;
  };

  const onClick = async () => {
    const rawCookies = getCookie('marketFavoritesCoin');
    const parsedCookies = unpackCookie(rawCookies);
    const pushedCookies = pushCookie(parsedCookies, e);
    const packedCookies = packCookie(pushedCookies);
    applyCookie(packedCookies);
    const coins = await onToggleCoin(drawTicker, e);
    setDrawTicker(coins);
  };

  return (
    <motion.div
      onClick={onClick}
      className="flex justify-center items-center h-full "
      whileHover={{
        scale: 1.1,
      }}
    >
      {e.rowData.isFavorite ? <StarRateIcon /> : <StarBorderIcon />}
    </motion.div>
  );
};

export const RenderNameColumn = (e: TableCellProps) => {
  const navigate = useNavigate();
  const selectCoinDefault = useRecoilValue(atomSelectCoinDefault);

  const onSelectClick = async (e: any) => {
    const clickedCoinInfo = e.rowData as ISelectCoinDefault;
    if (clickedCoinInfo === undefined) {
      return;
    }
    if (clickedCoinInfo.coinSymbol === selectCoinDefault.coinSymbol) {
      return;
    }
    const symbol = clickedCoinInfo.coinSymbol;
    const mSymbol = clickedCoinInfo.siseCrncCd === 'C0100' ? 'KRW' : 'BTC';
    navigate(`/${symbol}_${mSymbol}`);
  };

  return (
    <motion.div
      whileTap={{}}
      whileHover={{
        marginLeft: '1rem',
        scale: 1.1,
      }}
      className="flex flex-col justify-center w-full h-full"
      onClick={() => {
        onSelectClick(e);
      }}
    >
      {e.cellData}
      <div className="text-xs font-bmjua">
        {e.rowData.coinSymbol}/{e.rowData.siseCrncCd === 'C0100' ? 'KRW' : ''}
      </div>
    </motion.div>
  );
};

export const RenderCurrentPriceColumn = (e: TableCellProps) => {
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
};

export const RenderRateOfChange = (e: TableCellProps) => {
  const [isUp, setIsUp] = useState(true);
  useEffect(() => {
    if (e.rowData.a?.includes('-')) {
      setIsUp(false);
    } else {
      setIsUp(true);
    }
  }, [e]);
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
};

export const RenderU24 = (e: TableCellProps) => {
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
};

export const HeaderCoinName = (e: TableHeaderProps) => {
  return <div className="font-bmjua">자산</div>;
};

export const HeaderPrice = ({
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
    <div className="flex justify-center items-center font-bmjua  cursor-pointer">
      <div onClick={onClick}>현재가</div>
      <SortArrow direction={direction} active={arrowActive} />
    </div>
  );
};

export const HeaderRateOfChange = ({
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
    <div className="flex justify-center items-center font-bmjua  cursor-pointer">
      <div onClick={onClick}>변동률(당일)</div>
      <SortArrow direction={direction} active={arrowActive} />
    </div>
  );
};

export const HeaderVolume = ({
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
    <div className="flex justify-center items-center font-bmjua  cursor-pointer">
      <div onClick={onClick}>거래금액(24H)</div>
      <SortArrow direction={direction} active={arrowActive} />
    </div>
  );
};

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
