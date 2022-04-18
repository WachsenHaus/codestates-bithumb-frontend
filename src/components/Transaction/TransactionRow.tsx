import classNames from 'classnames';
import moment from 'moment';
import React from 'react';

const TransactionRow = ({
  time,
  price,
  contQty,
  buySellGb,
}: {
  time: string;
  price: string;
  contQty: string;
  buySellGb: string;
}) => {
  return (
    <div
      style={{
        display: 'grid',
        height: '30px',
        gridTemplateColumns: '30% 40% 30%',
      }}
    >
      <div className="flex justify-center items-center">
        {moment(time).format('HH:mm:ss')}
      </div>
      <div className="flex justify-center items-center">
        {Number(price).toLocaleString('ko-kr')}
      </div>
      <div
        className={classNames(
          `${
            buySellGb === '2' ? 'text-red-400' : 'text-blue-400'
          } flex justify-center items-center"`
        )}
      >
        <span>{Number(contQty).toFixed(4)}</span>
      </div>
    </div>
  );
};

export default TransactionRow;
