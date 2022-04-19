import React, { useEffect, useState } from 'react';
import { TableCellProps, TableHeaderProps } from 'react-virtualized';
import { SetterOrUpdater, useRecoilState, useSetRecoilState } from 'recoil';
import { AnimatePresence, motion } from 'framer-motion';
import produce from 'immer';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarRateIcon from '@mui/icons-material/StarRate';
import { atomDrawTicker, TypeDrawTicker } from '../../atom/drawData.atom';
import { atomSelectCoin, ISelectCoin } from '../../atom/selectCoin.atom';
import {
  applyCookie,
  ConvertStringPriceToKRW,
  getCookie,
  packCookie,
  pushCookie,
  unpackCookie,
} from '../../utils/utils';
import classNames from 'classnames';
import styles from '../../components/animation.module.css';
import { stubFalse } from 'lodash';

export const RenderFavoriteColumn = (e: TableCellProps) => {
  const [drawTicker, setDrawTicker] = useRecoilState(atomDrawTicker);

  const onToggleCoin = async (
    drawTicker: Array<TypeDrawTicker>,
    e: {
      rowData: TypeDrawTicker;
    }
  ) => {
    const next = produce(drawTicker, (item) => {
      const a = item.find((item) => item.coinSymbol === e.rowData.coinSymbol);
      if (a) {
        a.isFavorite = !a.isFavorite;
      }
    });
    return next;
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
  const [selectCoin, setSelectCoin] = useRecoilState(atomSelectCoin);
  const onSelectClick = async (e: any) => {
    const selectCoinInfo = e.rowData;
    if (selectCoinInfo === undefined) {
      return;
    }
    if (selectCoinInfo.coinType === selectCoin.coinSymbol) {
      return;
    }
    await setSelectCoin((prevData) => {
      return {
        ...prevData,
        coinType: selectCoinInfo.coinType,
        coinSymbol: selectCoinInfo.coinSymbol,
        e: selectCoinInfo.e,
        v24: selectCoinInfo.v24,
        u24: selectCoinInfo.u24,
        h: selectCoinInfo.h,
        l: selectCoinInfo.l,
        f: selectCoinInfo.f,
      };
    });
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
        {e.rowData.coinSymbol}/{e.rowData.m === 'C0100' ? 'KRW' : ''}
      </div>
    </motion.div>
  );
};

export const RenderCurrentPriceColumn = (e: TableCellProps) => {
  const [isUp, setIsUp] = useState('1px solid white');
  useEffect(() => {
    // console.log(e.rowData.isUp);
    if (e.rowData.isUp) {
      setIsUp('1px solid red');
    } else if (e.rowData.isUp === false) {
      setIsUp('1px solid blue');
    } else {
    }
  }, [e]);
  return (
    <motion.div className="flex items-center">
      <div>
        {ConvertStringPriceToKRW(e.cellData)}
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
  let price = ConvertStringPriceToKRW(e.rowData.a);
  if (isUp) {
    price = `+${price}`;
  } else {
    price = `${price}`;
  }

  return (
    <motion.div
      className={classNames(
        `flex flex-col w-full h-full`,
        `${isUp ? `text-red-500` : `text-blue-500`}`
      )}
    >
      <motion.div className="">{e.cellData}%</motion.div>
      <motion.div className="ml-4 text-sm">{price}</motion.div>
    </motion.div>
  );
};

export const HeaderTest = (e: TableHeaderProps) => {
  return <div>변동률(당일)</div>;
};
