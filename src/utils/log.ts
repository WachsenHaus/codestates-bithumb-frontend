import moment from 'moment';

export const Log = (message: any) => {
  console.log(`${moment().format('YYYY-MM-DD/HH:mm:ss')} ${message}`);
};
