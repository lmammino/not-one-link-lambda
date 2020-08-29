'use strict'

const getConfigFromEnv = require('../src/config')

it('should crete a configuration object from env vars', async () => {
  process.env = {
    DB_PATH: 'some-db-path',
    TAG_AE: 'aetag',
    TAG_DE: 'detag',
    WHITELIST: 'https://www.amazon.com/dp/1839214112?tag=loige0e-20;https://www.amazon.com/dp/B01D8HIIFU?tag=loige0e-20;https://www.amazon.com/dp/B08CHMDKW2?tag=loige0e-20'
  }

  const config = getConfigFromEnv()

  expect(config).toMatchSnapshot()
})

it('should create a configuration object with no whitelist if no WHITELIST is given', async () => {
  process.env = {
    DB_PATH: 'some-db-path',
    TAG_AE: 'aetag',
    TAG_DE: 'detag'
  }

  const config = getConfigFromEnv()

  expect(config).toMatchSnapshot()
})

it('should use a default db path if no one is specified', async () => {
  process.env = {}

  const config = getConfigFromEnv()

  expect(config).toMatchSnapshot()
})
