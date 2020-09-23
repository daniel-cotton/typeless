<img src="https://github.com/daniel-cotton/typeless/blob/master/docs/logo.svg">

Generate type definitions from a web-page. Type more whilst typing less with Typeless.

```js
const Typeless = require('@dancotton/typeless');
const config = require('./config.json');

(async () => {  
  const types = await Typeless.scrapeTypes(config);

  // Write files to disk using fs! 
  // For now, only supports a flat directory structure!
})()
```


## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install @dancotton/typeless
```

## Features

  * Automated Scraping for Documentation sites
  * Seamless Generation of Typescript interfaces (properties and types)
  * Automated Inheritance based on documentation.