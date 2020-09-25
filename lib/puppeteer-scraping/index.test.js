const scrapePage = require('./index');

const InterfaceDescription = require('../model/InterfaceDescription')
const path = require('path');

test('scrape tc-positive-multi.html', async () => {

  const [objectRowSelector, objectRowToNameSelector, objectRowToPropertiesSelector, objectRowToInheritanceSelector, propertyRowToNameSelector, propertyRowToTypeSelector] =
    ['body table#objects > tbody > tr', 'td:first-child', 'td:last-child > table > tbody > tr', 'td > span', 'td:first-child', 'td:last-child']
  
  const filePath = path.join(__dirname, '../../test/assets/tc-positive-multi.html');
  
  const scrapedTypeDefinitions = await scrapePage({
    pageURL: `file://${filePath}`,
    objectRowSelector,
    objectRowToInheritanceSelector,
    objectRowToPropertiesSelector,
    objectRowToNameSelector,
    propertyRowToNameSelector,
    propertyRowToTypeSelector
  })

  expect(scrapedTypeDefinitions)
    .toStrictEqual([
      new InterfaceDescription('TestObject', [
        {
          name: 'propOne',
          type: 'String'
        },
        {
          name: 'propTwo',
          type: 'Number'
        }
      ], 'ParentObject'),
      new InterfaceDescription('ParentObject', [
        {
          name: 'parentProp',
          type: 'Map<String, Number>'
        }
      ])
    ])
});
