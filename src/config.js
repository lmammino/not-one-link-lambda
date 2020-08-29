'use strict'

module.exports = function getConfigFromEnv () {
  const dbPath = process.env.DB_PATH || 'data/GeoLite2-Country.mmdb'
  const tagsMap = {
    'www.amazon.ae': process.env.TAG_AE,
    'www.amazon.ca': process.env.TAG_CA,
    'www.amazon.cn': process.env.TAG_CN,
    'www.amazon.co.jp': process.env.TAG_JP,
    'www.amazon.co.uk': process.env.TAG_GB,
    'www.amazon.com.au': process.env.TAG_AU,
    'www.amazon.com.br': process.env.TAG_BR,
    'www.amazon.com.mx': process.env.TAG_MX,
    'www.amazon.com.tr': process.env.TAG_TR,
    'www.amazon.de': process.env.TAG_DE,
    'www.amazon.es': process.env.TAG_ES,
    'www.amazon.fr': process.env.TAG_FR,
    'www.amazon.in': process.env.TAG_IN,
    'www.amazon.it': process.env.TAG_IT,
    'www.amazon.nl': process.env.TAG_NL,
    'www.amazon.sg': process.env.TAG_SG
  }
  const whitelist = process.env.WHITELIST ? process.env.WHITELIST.split(';').map(u => u.trim()) : undefined

  return {
    dbPath,
    tagsMap,
    whitelist
  }
}
