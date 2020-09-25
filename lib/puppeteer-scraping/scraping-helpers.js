const puppeteer = require('puppeteer');
const InterfaceDescription = require('../model/InterfaceDescription');

const constructObjectsFromScrapedData = scrapedTypes => {
  // Construct scraped values into objects
  const types = scrapedTypes.map(type => new InterfaceDescription(type.name, type.properties, type.inherits))
  return types;
}
  
const openBrowserToPage = async url => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  return {
    browser,
    page
  };
}

const scrapeTypesFromPage = async (page, selectors) => {
  return await page.evaluate((selectors) => {

    // Extract selectors from selectors array
    const [objectRowSelector, objectRowToNameSelector, objectRowToPropertiesSelector, objectRowToInheritanceSelector, propertyRowToNameSelector, propertyRowToTypeSelector] = selectors;
    // Fetch rows of typed objects from the page.
    const rows = iterableQuerySelectorAll(document, objectRowSelector);
    // Format object definitions using map function.
    const formattedObjectDefinitions = rows.map(extractObjectDefinitionFromRow);

    // Return below helper fn definitions....


    /**
     * 
     * @param {*} parentNode 
     * @param {*} selector 
     */
    function iterableQuerySelectorAll(parentNode, selector) {
      return [...parentNode.querySelectorAll(selector)];
    }

    /**
     * Does the current object exist?
     * 
     * @param {*} object 
     * @returns {Boolean} true if object exists, false if it doesn't
     */
    function exists(object) {
      return !!object;
    }

    function extractPropertyFromNode(node) {
      try {
        return ({
          name: node.querySelector(propertyRowToNameSelector).innerText,
          type: node.querySelector(propertyRowToTypeSelector).innerText
        })
      } catch {
        return null;
      }
    }

    function findParentTypeForObject(node) {  
      const possibleInheritance = node.querySelector(objectRowToInheritanceSelector);
      return possibleInheritance && possibleInheritance.innerText
    }

    function extractObjectDefinitionFromRow(row) {
      // Extract name DOM node.
      const nameNode = row.querySelector(objectRowToNameSelector);

      // Extract Properties Nodes as an iterable.
      const propertyNodes = iterableQuerySelectorAll(row, objectRowToPropertiesSelector);

      const formattedProperties = propertyNodes
        .map(extractPropertyFromNode)
        .filter(exists)

      const parentType = findParentTypeForObject(row);

      return {
        name: nameNode.innerText,
        properties: formattedProperties,
        inherits: parentType
      }
    }

    return formattedObjectDefinitions;
  }, selectors);
}

module.exports = {
  constructObjectsFromScrapedData,
  openBrowserToPage,
  scrapeTypesFromPage
}