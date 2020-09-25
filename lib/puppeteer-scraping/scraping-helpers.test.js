const { openBrowserToPage, constructObjectsFromScrapedData, scrapeTypesFromPage } = require('./scraping-helpers');

const InterfaceDescription = require('../model/InterfaceDescription')
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

test('openBrowserToPage executes puppeteer correctly', async () => {
  const { browser, page } = await openBrowserToPage('https://www.google.com/');
  expect(page.url())
    .toStrictEqual('https://www.google.com/')
  await page.close();
  expect(page.isClosed())
    .toBe(true);
  await browser.close();
});

test('constructObjectsFromScrapedData constructs correctly', () => {
  const name = "TestObject"
  const typedProperties = [{
    name: "PropOne",
    type: "String"
  }]
  const inherits = "Object";

  const testCases = [
    {
      name,
      properties: typedProperties,
      inherits
    },
    {
      name,
      properties: typedProperties
    }
  ]
  expect(constructObjectsFromScrapedData(testCases))
    .toStrictEqual([
      new InterfaceDescription(name, typedProperties, inherits),
      new InterfaceDescription(name, typedProperties)
    ])
});

test('scrapeTypesFromPage executes queries correctly', async () => {

  const selectors = [objectRowSelector, objectRowToNameSelector, objectRowToPropertiesSelector, objectRowToInheritanceSelector, propertyRowToNameSelector, propertyRowToTypeSelector] =
                    ['body table#objects > tbody > tr', 'td:first-child', 'td:last-child > table > tbody > tr', 'td > span', 'td:first-child', 'td:last-child']
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const testHTMLContent = await fs.readFile(path.join(__dirname, '../../test/assets/tc-positive-multi.html'), 'utf-8')
  await page.setContent(testHTMLContent);
  
  const scrapedTypes = await scrapeTypesFromPage(page, selectors);

  await page.close();
  await browser.close();

  expect(scrapedTypes)
    .toStrictEqual([
      {
        name: 'TestObject',
        inherits: 'ParentObject',
        properties: [
          {
            name: 'propOne',
            type: 'String'
          },
          {
            name: 'propTwo',
            type: 'Number'
          }
        ]
      },
      {
        name: 'ParentObject',
        inherits: null,
        properties: [
          {
            name: 'parentProp',
            type: 'Map<String, Number>'
          }
        ]
      }
    ])
});
