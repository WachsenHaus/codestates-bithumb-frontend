import { Box } from '@mui/material';
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import styles from '../../components/animation.module.css';
import { convertStringPriceToKRW } from '../../utils/utils';

const OrderbookRow = ({
  price,
  r,
  orderType,
  eventType,
  quantity,
  quantityRatio,
  index,
}: // ref,
{
  price: string;
  r?: string;
  orderType: 'ask' | 'bid';
  eventType: 'ask' | 'bid' | undefined;
  quantity: string;
  quantityRatio: string;
  index?: any;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef && index === 0) {
      scrollRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }, [index]);
  return (
    <Box className={classNames(`flex justify-around items-center w-full`)} ref={scrollRef}>
      <Box
        className={classNames(
          `w-1/2`,
          `flex  justify-around`,
          `${orderType === 'ask' ? 'bg-blue-700' : 'bg-red-700'}`,
          `${orderType === 'ask' ? 'text-blue-400' : 'text-red-400'}`,
          `bg-opacity-5`
        )}
      >
        <span
          className={classNames(
            // `will-change-transform`,
            `text-left`,
            `${eventType === 'ask' ? `shadow-inner shadow-blue-900 ${styles.askEffect}` : ''}`,
            `${eventType === 'bid' ? `shadow-inner shadow-red-900 ${styles.bidEffect}` : ''}`
          )}
        >
          {convertStringPriceToKRW(price)}
        </span>
        <span>{r}%</span>
      </Box>
      <Box className={classNames(`w-1/2`, `flex justify-start relative`)}>
        {Number(quantity).toFixed(4)}
        <Box
          className={classNames(`absolute left-0`)}
          sx={{
            width: `${quantityRatio}%`,
            height: '100%',
            backgroundColor: `${orderType === 'ask' ? '#416ac25e;' : '#ff000021;'}`,
          }}
        />
      </Box>
    </Box>
  );
};

export default React.memo(OrderbookRow);
