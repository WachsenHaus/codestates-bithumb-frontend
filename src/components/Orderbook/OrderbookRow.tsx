import { Box } from '@mui/material';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Meter } from 'grommet';
import React from 'react';
import styles from '../../components/animation.module.css';

const OrderbookRow = ({
  price,
  orderType,
  eventType,
  quantity,
}: {
  price: string;
  orderType: 'ask' | 'bid';
  eventType: 'ask' | 'bid' | undefined;
  quantity: string;
}) => {
  return (
    <Box className="flex justify-around items-center w-full ">
      <Box
        className={classNames(
          `w-1/2`,
          `flex  justify-around`,
          `${orderType === 'ask' ? 'text-blue-400' : 'text-red-400'}`
        )}
      >
        <span
          className={classNames(
            `${eventType === 'ask' ? `${styles.askEffect}` : ''}`,
            `${eventType === 'bid' ? `${styles.bidEffect}` : ''}`
          )}
        >
          {Number(price).toLocaleString('ko-kr')}
        </span>
        <span>{`     +0.16%`}</span>
      </Box>
      <Box className={classNames(`w-1/2`, `flex justify-start relative`)}>
        {Number(quantity).toFixed(4)}
        <Box
          className={classNames(`absolute left-0`)}
          sx={{
            width: `${(Number(quantity) * 50) % 100}%`,

            height: '100%',
            backgroundColor: '#ee424219',
          }}
        />
      </Box>
    </Box>
  );
};

export default OrderbookRow;
