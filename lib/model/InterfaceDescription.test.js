const InterfaceDescription = require('./InterfaceDescription');
const MissingArgumentError = require('../error/MissingArgumentError');

test('constructs successfully with all args', () => {
  const name = "TestObject"
  const typedProperties = [{
    name: "PropOne",
    type: "String"
  }]
  const inherits = "Object";
  const item = new InterfaceDescription(name, typedProperties, inherits)
  expect(item.name).toBe(name);
  expect(item.typedProperties).toBe(typedProperties);
  expect(item.inherits).toBe(inherits);
});

test('constructs successfully with missing inherits arg', () => {
  const name = "TestObject"
  const typedProperties = [{
    name: "PropOne",
    type: "String"
  }]
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.name).toBe(name);
  expect(item.typedProperties).toBe(typedProperties);
  expect(item.inherits).toBe(null);
});

test('returns empty string for non-global property types', () => {
  const name = "TestObject"
  const typedProperties = [
    {
      name: "PropOne",
      type: "String"
    },
    {
      name: "PropOne",
      type: "Boolean"
    },
    {
      name: "PropOne",
      type: "Map"
    },
    {
      name: "PropOne",
      type: "Number"
    }
  ]
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.imports).toBe("");
});

test('returns correct uniqueTypes for single global property type', () => {
  const name = "TestObject"
  const typedProperties = [{
    name: "PropOne",
    type: "String"
  }]
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.uniqueTypes).toStrictEqual(["String"]);
});

test('returns correct import string for single non-global property type', () => {
  const name = "TestObject"
  const typedProperties = [
    {
      name: "PropOne",
      type: "String"
    },{
      name: "PropOne",
      type: "Fruit"
    }
]
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.imports).toBe("const Fruit = require(\"./Fruit\");");
});

test('returns correct uniqueTypes for single non-global property types', () => {
  const name = "TestObject"
  const typedProperties = [{
    name: "PropOne",
    type: "Fruit"
  }]
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.uniqueTypes).toStrictEqual(["Fruit"]);
});

test('returns correct import string for single non-global inherits type', () => {
  const name = "TestObject";
  const typedProperties = [];
  const inherits = "Fruit";
  const item = new InterfaceDescription(name, typedProperties, inherits)
  expect(item.imports).toBe("const Fruit = require(\"./Fruit\");");
});

test('returns correct uniqueTypes for single non-global property types', () => {
  const name = "TestObject"
  const typedProperties = [];
  const inherits = "Fruit";
  const item = new InterfaceDescription(name, typedProperties, inherits)
  expect(item.uniqueTypes).toStrictEqual(["Fruit"]);
});

test('de-duplicates common property types and inheritance types correctly', () => {
  const name = "TestObject"
  const typedProperties = [
    {
      name: "PropOne",
      type: "Fruit"
    }
  ];
  const inherits = "Fruit";
  const item = new InterfaceDescription(name, typedProperties, inherits)
  expect(item.uniqueTypes).toStrictEqual(["Fruit"]);
});

test('de-duplicates common property types (Two) and inheritance types correctly', () => {
  const name = "TestObject"
  const typedProperties = [
    {
      name: "PropOne",
      type: "Fruit"
    },
    {
      name: "PropOne",
      type: "Fruit"
    }
  ];
  const inherits = "Fruit";
  const item = new InterfaceDescription(name, typedProperties, inherits)
  expect(item.uniqueTypes).toStrictEqual(["Fruit"]);
});

test('de-duplicates common property types (Two) and inheritance types correctly', () => {
  const name = "TestObject"
  const typedProperties = [
    {
      name: "PropOne",
      type: "Fruit"
    },
    {
      name: "PropOne",
      type: "Apple"
    }
  ];
  const inherits = "Fruit";
  const item = new InterfaceDescription(name, typedProperties, inherits)
  expect(item.uniqueTypes).toStrictEqual(["Fruit", "Apple"]);
});

test('de-duplicate properties handles array types correctly', () => {
  const name = "TestObject"
  const typedProperties = [
    {
      name: "PropOne",
      type: "Fruit[]"
    },
    {
      name: "PropOne",
      type: "Apple"
    }
  ];
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.uniqueTypes).toStrictEqual(["Fruit", "Apple"]);
});

test('de-duplicate properties handles map types correctly', () => {
  const name = "TestObject"
  const typedProperties = [
    {
      name: "PropOne",
      type: "Map<String, Fruit>"
    },
    {
      name: "PropOne",
      type: "Apple"
    }
  ];
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.uniqueTypes).toStrictEqual(["Map", "String", "Fruit", "Apple"]);
});

test('returns correct import string for multiple non-global property type', () => {
  const name = "TestObject"
  const typedProperties = [
    {
      name: "PropOne",
      type: "String"
    }, {
      name: "PropOne",
      type: "Fruit"
    },{
      name: "PropOne",
      type: "Apple"
    }
]
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.imports).toStrictEqual("const Fruit = require(\"./Fruit\");\nconst Apple = require(\"./Apple\");");
});

test('returns correct declaration string with name', () => {
  const name = "TestObject"
  const typedProperties = [];
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.interfaceDeclaration)
    .toStrictEqual(`interface TestObject`);
});

test('returns correct declaration string with name and inheritance', () => {
  const name = "TestObject"
  const typedProperties = [];
  const inherits = 'ParentType'
  const item = new InterfaceDescription(name, typedProperties, inherits)
  expect(item.interfaceDeclaration)
    .toStrictEqual(`interface TestObject extends ParentType`);
});




test('returns empty string for properties when none defined', () => {
  const name = "TestObject"
  const typedProperties = [];
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.interfaceProperties)
    .toStrictEqual("");
});

test('returns correct string for single property', () => {
  const name = "TestObject"
  const typedProperties = [
    {
      name: "propOne",
      type: "String"
    }
  ];
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.interfaceProperties)
    .toStrictEqual("propOne: String;");
});

test('returns correct string for multiple properties', () => {
  const name = "TestObject"
  const typedProperties = [
    {
      name: "propOne",
      type: "String"
    },
    {
      name: "propTwo",
      type: "Map<String>"
    }
  ];
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.interfaceProperties)
    .toStrictEqual("propOne: String;\n  propTwo: Map<String>;");
});




test('returns correct definition string for no properties or inheritance', () => {
  const name = "TestObject"
  const typedProperties = [];
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.typeFileString)
    .toStrictEqual(`module.exports = interface TestObject {
  
}`);
});

test('returns correct definition string for single property', () => {
  const name = "TestObject"
  const typedProperties = [
    {
      name: "propOne",
      type: "String"
    }
  ];
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.typeFileString)
    .toStrictEqual(`module.exports = interface TestObject {
  propOne: String;
}`);
});

test('returns correct definition string for multiple properties', () => {
  const name = "TestObject"
  const typedProperties = [
    {
      name: "propOne",
      type: "String"
    },
    {
      name: "propTwo",
      type: "Number"
    }
  ];
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.typeFileString)
    .toStrictEqual(`module.exports = interface TestObject {
  propOne: String;
  propTwo: Number;
}`);
});

test('returns correct definition string for single property with imports', () => {
  const name = "TestObject"
  const typedProperties = [
    {
      name: "propOne",
      type: "Fruit"
    }
  ];
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.typeFileString)
    .toStrictEqual(`const Fruit = require("./Fruit");

module.exports = interface TestObject {
  propOne: Fruit;
}`);
});

test('returns correct definition string for properties with imports', () => {
  const name = "TestObject"
  const typedProperties = [
    {
      name: "propOne",
      type: "Map<String,Fruit>"
    },
    {
      name: "propTwo",
      type: "Apple"
    }
  ];
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.typeFileString)
    .toStrictEqual(`const Fruit = require("./Fruit");
const Apple = require("./Apple");

module.exports = interface TestObject {
  propOne: Map<String,Fruit>;
  propTwo: Apple;
}`);
});

test('returns correct definition string for properties with imports', () => {
  const name = "TestObject"
  const typedProperties = [
    {
      name: "propOne",
      type: "Map<String, Fruit>"
    },
    {
      name: "propTwo",
      type: "Apple"
    }
  ];
  const item = new InterfaceDescription(name, typedProperties)
  expect(item.typeFileString)
    .toStrictEqual(`const Fruit = require("./Fruit");
const Apple = require("./Apple");

module.exports = interface TestObject {
  propOne: Map<String, Fruit>;
  propTwo: Apple;
}`);
});

test('returns correct definition string for inheritance with imports', () => {
  const name = "Apple"
  const typedProperties = [
    {
      name: "propOne",
      type: "String"
    }
  ];
  const inherits = "Fruit";
  const item = new InterfaceDescription(name, typedProperties, inherits)
  expect(item.typeFileString)
    .toStrictEqual(`const Fruit = require("./Fruit");

module.exports = interface Apple extends Fruit {
  propOne: String;
}`);
});




test('throws error if missing name', () => {
  const name = null;
  const typedProperties = [{
    name: "PropOne",
    type: "String"
  }]
  
  function constructInterfaceWithMissingProperties() {
    new InterfaceDescription(name, typedProperties)
  }
  expect(constructInterfaceWithMissingProperties).toThrow(MissingArgumentError);
  expect(constructInterfaceWithMissingProperties)
    .toThrow('Failed, argument with name \'name\' missing');
});

test('throws error if missing typedProperties', () => {
  const name = "TestObject"
  
  function constructInterfaceWithMissingProperties() {
    new InterfaceDescription(name)
  }
  expect(constructInterfaceWithMissingProperties).toThrow(MissingArgumentError);
  expect(constructInterfaceWithMissingProperties)
    .toThrow('Failed, argument with name \'typedProperties\' missing');
});


