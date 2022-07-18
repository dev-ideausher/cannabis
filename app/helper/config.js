const config = {
    default: {
      jwtSecret: 'ideaUsher@2021',
      database: {
        url: 'mongodb://localhost:27017/cannabisdb',
        username: '',
        password: ''
      },
      SALT: 'cannbis@!*><2020',
      BaseUrl: 'https://localhost:6000/',
      port: 6000
    },
    development: {
        jwtSecret: 'ideaUsher@2021',
        database: {
          url: 'mongodb://localhost:27017/cannabisdb',
          username: '',
          password: ''
        },
        SALT: 'cannbis@!*><2020',
        BaseUrl: 'https://localhost:6000/',
        port: 6000
    }
  }
  
  exports.get = function get(env) {
      if (env == undefined) {
          return config.default
      } else {
          return config[env] || config.default
      }
  
  }