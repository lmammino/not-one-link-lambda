'use strict'

const mockConfig = {}

jest.mock('mmdb-reader', () => class MockReader {
  lookup (ip) {
    if (ip === '8.8.8.8') {
      return null
    }

    return { country: { iso_code: 'GB' } }
  }
})
jest.mock('../src/config', () => () => mockConfig)

beforeAll(() => {
  delete require.cache[require.resolve('../src/index')]
})

it('should fail if no url parameter is passed', async () => {
  mockConfig.dbPath = 'some/path/to.mmdb'
  const { handler } = require('../src/index')

  const event = {}
  const context = {}

  const response = await handler(event, context)
  expect(response.statusCode).toBe(400)
  expect(response.body).toBe('Invalid request, `url` querystring parameter not provided')
})

it('should fail if there a whitelist and the given url is not in the whitelist', async () => {
  mockConfig.dbPath = 'some/path/to.mmdb'
  mockConfig.whitelist = ['https://amazon.com/dp/whitelisted/']
  const { handler } = require('../src/index')

  const event = {
    queryStringParameters: {
      url: 'https://www.amazon.com/dp/not-whitelisted/'
    }
  }
  const context = {}

  const response = await handler(event, context)
  expect(response.statusCode).toBe(403)
  expect(response.body).toBe('The given `url` is forbidden')
})

it('should return the given url if cannot find a match for the user ip', async () => {
  mockConfig.dbPath = 'some/path/to.mmdb'
  mockConfig.whitelist = undefined
  const { handler } = require('../src/index')
  const event = {
    queryStringParameters: {
      url: 'https://www.amazon.com/dp/someproduct/'
    },
    requestContext: {
      identity: {
        sourceIp: '8.8.8.8'
      }
    }
  }
  const context = {}

  const response = await handler(event, context)
  expect(response.statusCode).toBe(302)
  expect(response.body).toBe('')
  expect(response.headers).toEqual({
    Location: 'https://www.amazon.com/dp/someproduct/'
  })
})

it('should redirect to the closest amazon store for the given user ip', async () => {
  mockConfig.dbPath = 'some/path/to.mmdb'
  mockConfig.whitelist = undefined
  mockConfig.tagsMap = {
    'www.amazon.co.uk': 'someNewTag'
  }
  const { handler } = require('../src/index')
  const event = {
    queryStringParameters: {
      url: 'https://www.amazon.com/dp/someproduct/?tag=someTag'
    },
    requestContext: {
      identity: {
        sourceIp: '1.1.1.1'
      }
    }
  }
  const context = {}

  const response = await handler(event, context)
  expect(response.statusCode).toBe(302)
  expect(response.body).toBe('')
  expect(response.headers).toEqual({
    Location: 'https://www.amazon.co.uk/dp/someproduct/?tag=someNewTag'
  })
})

it('should fail if it cannot remap url', async () => {
  mockConfig.dbPath = 'some/path/to.mmdb'
  mockConfig.whitelist = undefined
  mockConfig.tagsMap = {
    'www.amazon.co.uk': 'someNewTag'
  }
  const { handler } = require('../src/index')
  const event = {
    queryStringParameters: {
      url: 'invalidURL'
    },
    requestContext: {
      identity: {
        sourceIp: '1.1.1.1'
      }
    }
  }
  const context = {}

  const response = await handler(event, context)
  expect(response.statusCode).toBe(400)
  expect(response.body).toBe('Invalid `url` queryString provided')
})
