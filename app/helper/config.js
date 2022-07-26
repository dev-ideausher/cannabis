const config = {
    default: {
      jwtSecret: 'ideaUsher@2022',
      database: {
        url: 'mongodb://localhost:27017/cannabisdb',
        username: '',
        password: ''
      },
      SALT: 'cannabis@!*><2022',
      HeadersUrl:'localhost:6000',
      BaseUrl: 'https://localhost:6000/',
      port: 6000,
      AWS_ACCESS_KEY:"AKIAYBTHCJZG6SQKCB4O",
      AWS_SECRET_KEY:"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",
      AWS_S3_USER_BUCKET_NAME:"cannabisimage"
    },
    development: {
        jwtSecret: 'ideaUsher@2',
        database: {
          url: 'mongodb://localhost:27017/cannabisdb',
          username: '',
          password: ''
        },
        SALT: 'cannabis@!*><2022',
        HeadersUrl:'localhost:6000',
        BaseUrl: 'https://localhost:6000/',
        port: 6000,
        AWS_ACCESS_KEY:"AKIAYBTHCJZG6SQKCB4O",
        AWS_SECRET_KEY:"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",
        AWS_S3_USER_BUCKET_NAME:"cannabisimage"
    }
  }
  
  exports.get = function get(env) {
      if (env == undefined) {
          return config.default
      } else {
          return config[env] || config.default
      }
  
  }