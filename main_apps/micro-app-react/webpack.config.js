const { merge } = require('webpack-merge')
const config_base = require('./config/webpack.config.base')
const config_dev = require('./config/webpack.config.dev')
const config_prod = require('./config/webpack.config.prod')

module.exports = merge(config_base, process.env.ENV == 'prod' ? config_prod : config_dev)
