const Typeless = require('../');
const config = require('./config.json');

(async () => {  
  const types = await Typeless.scrapeTypes(config.figma);
  
  console.log(`Scraped ${types.length} types...`);
  console.log(types[5].typeFileString);

  // Write files to disk using fs! 
  // For now, only supports a flat directory structure!
})()