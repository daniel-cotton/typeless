const InterfaceDescription = require('../model/InterfaceDescription');

const { openBrowserToPage, constructObjectsFromScrapedData, scrapeTypesFromPage } = require('./scraping-helpers');

/**
 * Scrape a given webpage for types, generating JS objects 
 * describing the types of entities described on that page
 * 
 * @returns {InterfaceDescription[]} an array of objects describing each type on the page.
 */
module.exports = async ({
  pageURL,
  objectRowSelector,
  objectRowToNameSelector,
  objectRowToPropertiesSelector,
  objectRowToInheritanceSelector,
  propertyRowToNameSelector,
  propertyRowToTypeSelector
 }) => {
   // Puppeteer init
   const { browser, page } = await openBrowserToPage(pageURL);

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