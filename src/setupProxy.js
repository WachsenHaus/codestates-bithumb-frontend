// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/trade-info/v1/getTradeData',
    createProxyMiddleware({
      target: 'https://pub1.bithumb.com/',
      changeOrigin: true,
    })
  );
};
