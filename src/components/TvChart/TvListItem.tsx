import classNames from 'classnames';
import React from 'react';

const TvListItem = ({ onClick, children, className }: { onClick: () => void; children: React.ReactNode; className?: string }) => {
  return (
    <li className={classNames(className, `w-full my-5`, `text-center rounded-lg border-2`, `hover:cursor-pointer `, `hover:border-blue-400`)} onClick={onClick}>
      {children}
    </li>
  );
};

export default React.memo(TvListItem);
