require('dotenv').config();

process.env.SERVER_TYPE = 'jobs';
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const keystone = require('keystone');
const glob = require('glob');
const path = require('path');

// See http://keystonejs.com/guide/config for available options
keystone.init({
  port: 8807,
  name: '系统后台任务',
  brand: '系统后台任务',
  headless: true,
  session: false,
  'auto update': false,
  'cookie secret': 'xxx',
  'db name': 'mixin-operator',
  mongo: process.env.MONGO_URI,
  'module root': path.join(__dirname),
});

// Load keystone Models
keystone.import('models');
keystone.start(() => {
  glob('server/jobs/*.js', err => {
    if (err) {
      return logger.error('cannot find any job file');
    }

    return require('./jobs/test.js').init();
  });
});
