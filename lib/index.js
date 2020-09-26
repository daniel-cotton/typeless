
/**
 * Typeless. Generate types from documentation using puppeteer.
 * @module @dancotton/typeless
 */

/**
 * Scrape a given webpage for types, generating JS objects 
 * describing the types of entities described on that page
 * 
 * @param {TypelessConfig} {} object describing the urls, selectors and options to use when scraping.
 * @returns {InterfaceDescription[]} an array of objects describing each type on the page.
 */
exports.scrapeTypes = require('./puppeteer-scraping');

/**
 * A class describing an entity's interface, containing 
 * information about the name of the entity, it's properties
 * and it's inheritance.
 * 
 * This class provides getters to construct Typescript
 * interfaces as strings, from the object's contents.
 */
exports.InterfaceDescription = require('./model/InterfaceDescription');