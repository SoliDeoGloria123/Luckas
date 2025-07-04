const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy para rutas de API
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
      logLevel: 'debug'
    })
  );

  // Proxy para archivos estáticos externos
  app.use(
    '/Externo',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
      logLevel: 'debug'
    })
  );
};