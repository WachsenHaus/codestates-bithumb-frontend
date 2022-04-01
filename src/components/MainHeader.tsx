import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Clock } from 'grommet';
import { url } from 'inspector';
import React from 'react';
import styled from 'styled-components';
import CI from '../asset/img/sp_main_new.png';

const HeaderStyled = styled(motion.div)`
  /* width: '179px',
  height: '52px', */
`;

const MainHeader = () => {
  return (
    <div
      className="h-full "
      style={{
        gridRowStart: 1,
        gridRowEnd: 2,
        gridColumn: 1,
      }}
    >
      <motion.div
        className={classNames(`h-full flex items-center flex-grow relative`)}
      >
        <HeaderStyled
          whileHover={{
            scaleX: 0.9,
          }}
          className={classNames(`w-full h-full bg-no-repeat ml-4`)}
          style={{
            width: '179px',
            height: '52px',
            backgroundImage: `url(${CI})`,
            backgroundPosition: '-150px 14px',
          }}
        ></HeaderStyled>
        <Clock className="right-0 absolute" type="digital" />
      </motion.div>
    </div>
  );
};
export default MainHeader;
