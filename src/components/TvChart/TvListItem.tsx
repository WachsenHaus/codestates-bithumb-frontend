import classNames from 'classnames';
import React from 'react';

const TvListItem = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => {
  return (
    <li className={classNames(`w-full my-5`, `text-center rounded-lg border-2`, `hover:cursor-pointer`, `hover:border-blue-400`)} onClick={onClick}>
      {children}
    </li>
  );
};

export default React.memo(TvListItem);
