import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Clock, Paragraph, Text } from 'grommet';
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
      <motion.div className={classNames(`h-full flex items-stretch  relative`)}>
        <HeaderStyled
          whileHover={{
            scaleX: 0.9,
          }}
          className={classNames(`w-full h-full bg-no-repeat ml-4`)}
          style={{
            width: '179px',
            height: '52px',
            flexGrow: 0,
            backgroundImage: `url(${CI})`,
            backgroundPosition: '-150px 14px',
          }}
        />
        <div
          className={classNames(`flex justify-center items-center`)}
          style={
            {
              // flexGrow: 9,
              // marginRight: '3rem',
            }
          }
        >
          <span className="right-32 absolute ">
            현재 차트,호가,체결내역은 비트코인(원화)만 지원됩니다.
          </span>
          <Clock className="right-2 absolute" type="digital" />
        </div>
      </motion.div>
    </div>
  );
};
export default MainHeader;
