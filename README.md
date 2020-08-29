# not-one-link-lambda

[![CI](https://github.com/lmammino/not-one-link/workflows/CI/badge.svg)](https://github.com/lmammino/not-one-link/actions?query=workflow%3ACI)
[![codecov](https://codecov.io/gh/lmammino/not-one-link-lambda/branch/master/graph/badge.svg)](https://codecov.io/gh/lmammino/not-one-link-lambda)

An AWS lambda that allows you to host your own alternative of Amazon OneLink™️ to rewrite Amazon URLs.

It will allow you to create links such as:

```plain
https://1234567890.execute-api.us-east-1.amazonaws.com/dev/?url=https%3A%2F%2Fwww.amazon.com%2Fdp%2F1839214112%3Ftag%3Dloige0e-20
```

Which will redirect the user to the same product page but on the closest Amazon store, for instance:

```plain
https://www.amazon.co.uk/dp/1839214112?tag=loige09-21
```

Basically redirecting the user to amazon.co.uk (and replacing the affiliate tag).


This project is based on [`not-one-link`](https://github.com/lmammino/not-one-link/). Check it out for a comprehensive description of the motivation behind this project.


## Requirements

This Lambda tries to identify the user location from their IP. To do so it needs a `.mmdb` database (not included).

You could get your own copy of `GeoLite2-Country.mmdb` from [maxmind.com](https://dev.maxmind.com/geoip/geoip2/geolite2/). The DB is available for free, you just need to sign up. If you have a commercial license with MaxMind, you should be able to use the PRO version of the DB as well, but the lambda has been tested only with the free version, so your mileage may vary.

Once you obtain your copy of `GeoLite2-Country.mmdb` you just need to copy the file in the `data` folder.

You also need to have your own AWS account and your machine properly configured with the [AWS CLI](https://aws.amazon.com/cli/) installed and properly authenticated.

Finally, you will need **Node.js (v12+)** installed in your machine.


## Deployment

Install all the necessary dependencies with:

```bash
npm install
```

Then run the deployment with:

```bash
npm run deploy
```

If all goes well you will see the URL of your Lambda in the console output, for instance something like this:

```plain
https://1234567890.execute-api.us-east-1.amazonaws.com/dev/
```

Which you could then use by creating URLs as follows:

```plain
https://1234567890.execute-api.us-east-1.amazonaws.com/dev/?url=<your_url_encoded_amazon_product_url>
```

## Configuration

The deployment can be widely configured by setting some environment variables before running the deployment command.

For simplicity you could save this variables in a `.env` file and then run the deployment with:

```bash
source .env
npm run deploy
```

You can start creating your `.env` file by using the [`.env~sample`](.env~sample) file included in the repo.


### Redefine the location of the database

If you need/want to save the .mmdb to another path (e.g. because you want to use a different database name or because you are using your custom lambda layer to bring the database in). you can redefine the path by setting the environment variable `DB_PATH`.
The path can be absolute or relative to the main folder of the project.


### Rewrite your affiliate tags for different Amazon stores

Amazon associates (Amazon's affiliate program) allows you to earn referral credits everytime you generate sales for Amazon. Unfortunately, every Amazon store requires you to register for the affiliate program independently and it will provide you with a different affiliate tag to be included in your URLs (i.e. your affiliate tag will be different between amazon.com and amazon.co.uk). You can provide all your affiliate tags using the following environmnet variables:

  - `TAG_AE`: Affiliate tag for `www.amazon.ae`
  - `TAG_CA`: Affiliate tag for `www.amazon.ca`
  - `TAG_CN`: Affiliate tag for `www.amazon.cn`
  - `TAG_JP`: Affiliate tag for `www.amazon.co.jp`
  - `TAG_GB`: Affiliate tag for `www.amazon.co.uk`
  - `TAG_AU`: Affiliate tag for `www.amazon.com.au`
  - `TAG_BR`: Affiliate tag for `www.amazon.com.br`
  - `TAG_MX`: Affiliate tag for `www.amazon.com.mx`
  - `TAG_TR`: Affiliate tag for `www.amazon.com.tr`
  - `TAG_DE`: Affiliate tag for `www.amazon.de`
  - `TAG_ES`: Affiliate tag for `www.amazon.es`
  - `TAG_FR`: Affiliate tag for `www.amazon.fr`
  - `TAG_IN`: Affiliate tag for `www.amazon.in`
  - `TAG_IT`: Affiliate tag for `www.amazon.it`
  - `TAG_NL`: Affiliate tag for `www.amazon.nl`
  - `TAG_SG`: Affiliate tag for `www.amazon.sg`


### Whitelist only specific Amazon URLs

It is a good idea to whitelist the product URLs you want the Lambda to be able to rewrite to limit abuse of your Lamdba.

If you want to do so, you can specify the whitelist by setting the environment variable `WHITELIST`. This variable can contain one or more URLs (separated by `;`), for example:

```bash
export WHITELIST="https://www.amazon.com/dp/1839214112?tag=loige0e-20;https://www.amazon.com/dp/B01D8HIIFU?tag=loige0e-20"
```


## Contributing

Everyone is very welcome to contribute to this project. You can contribute just by submitting bugs or
suggesting improvements by [opening an issue on GitHub](https://github.com/lmammino/not-one-link-lambda/issues).

You can also submit PRs as long as you adhere with the code standards and write tests for the proposed changes.

## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
