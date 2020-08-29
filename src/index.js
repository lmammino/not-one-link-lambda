'use strict'

const rewriteUrl = require('not-one-link')
const MMDBReader = require('mmdb-reader')
const config = require('./config')()

const reader = new MMDBReader(config.dbPath)

module.exports.handler = async function handler (event, context) {
  const amazonUrl = event.queryStringParameters && event.queryStringParameters.url

  if (!amazonUrl) {
    return {
      statusCode: 400,
      body: 'Invalid request, `url` querystring parameter not provided'
    }
  }

  if (config.whitelist && !config.whitelist.includes(amazonUrl)) {
    return {
      statusCode: 403,
      body: 'The given `url` is forbidden'
    }
  }

  const ip = event.requestContext.identity.sourceIp

  const lookupRes = reader.lookup(ip)
  if (!lookupRes) {
    // if cannot find a match for the user ip returns the original url
    return {
      statusCode: 302,
      body: '',
      headers: {
        Location: amazonUrl
      }
    }
  }

  const userCountry = lookupRes.country.iso_code

  try {
    const redirectUrl = rewriteUrl(amazonUrl, userCountry, config.tagsMap)
    return {
      statusCode: 302,
      body: '',
      headers: {
        Location: redirectUrl
      }
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: 'Invalid `url` queryString provided'
    }
  }
}
