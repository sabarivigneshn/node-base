export const ProdConfig = Object.freeze({
  DBConnections: {
    database: {
      user: '',
      password: '',
      host: '',
      database: '',
      requestTimeout: 300000,
      dbType: 'mysql'
    },
  },
  Port: 5000, BaseRoute: '/api',
});
