const InterfaceDescription = require('../model/InterfaceDescription');

const { openBrowserToPage, constructObjectsFromScrapedData, scrapeTypesFromPage } = require('./scraping-helpers');

/**
 * @typedef {Object} TypelessConfig
 * @property {string} pageURL - the url for the site describing the entities
 * @property {string} objectRowSelector - a CSS selector returning the rows on the page, one for each object.
 * @property {string} objectRowToNameSelector - a CSS selector to be queried upon each row to find the 'name' node for that entity
 * @property {string} objectRowToPropertiesSelector - a CSS selector to be queried upon each row to find the 'property' nodes for that entity
 * @property {string} objectRowToInheritanceSelector - a CSS selector to be queried upon each row to find the 'inheritance' node for that entity
 * @property {string} propertyRowToNameSelector - a CSS selector to be queried upon each property to find the 'name' node for that property
 * @property {string} propertyRowToTypeSelector - a CSS selector to be queried upon each property to find the 'type' node for that property
 * @property {PuppeteerOptions} puppeteerOptions an object to be passed into the puppeteer 'launch' method when invoked. https://pptr.dev/#?product=Puppeteer&version=v5.3.1&show=api-puppeteerlaunchoptions
 */


/**
 * @typedef {Object} PuppeteerOptions an object to be passed into the puppeteer 'launch' method
 */

/**
 * Scrape a given webpage for types, generating JS objects 
 * describing the types of entities described on that page
 * 
 * @param {TypelessConfig} {} object describing the urls, selectors and options to use when scraping.
 * @returns {InterfaceDescription[]} an array of objects describing each type on the page.
 */
async function scrapeTypes ({
  pageURL,
  objectRowSelector,
  objectRowToNameSelector,
  objectRowToPropertiesSelector,
  objectRowToInheritanceSelector,
  propertyRowToNameSelector,
  propertyRowToTypeSelector,
  puppeteerOptions
 }) {
   // Puppeteer init
   const { browser, page } = await openBrowserToPage(pageURL, puppeteerOptions);

   console.log("Page open");
   
   // Scrape types from the webpage.
   const scrapedTypes = await scrapeTypesFromPage(page, [objectRowSelector, objectRowToNameSelector, objectRowToPropertiesSelector, objectRowToInheritanceSelector, propertyRowToNameSelector, propertyRowToTypeSelector]);

   console.log("Types Scraped");

   // Construct scraped values into objects
   const types = constructObjectsFromScrapedData(scrapedTypes)

   console.log("Objects constructed");

   // Shutdown puppeteer
   await page.close();
   await browser.close();

   console.log("Process complete.");

   return types;
}

module.exports = scrapeTypes;