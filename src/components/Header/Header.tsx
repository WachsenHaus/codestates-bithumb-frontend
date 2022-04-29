import { AppBar, Box, Toolbar } from '@mui/material';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React from 'react';
import CI from '../../asset/img/sp_main_new.png';
import bg_main from '../../asset/img/bg_main.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <AppBar
      position="static"
      sx={{
        width: '100vw',
        backgroundImage: `url(${bg_main})`,
      }}
    >
      <Toolbar>
        <motion.div
          whileHover={{
            scaleX: 0.9,
          }}
          className={classNames(`w-full h-full bg-no-repeat ml-4`)}
          style={{
            marginTop: '-1.2rem',
            width: '179px',
            height: '52px',
            flexGrow: 0,
            backgroundImage: `url(${CI})`,
            backgroundPosition: '29px 14px',
          }}
          onClick={() => {
            navigate('/');
          }}
        />
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(Header);
