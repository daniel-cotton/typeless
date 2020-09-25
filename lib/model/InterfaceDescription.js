
const { arrayToUnique } = require('../utils/array');
const MissingArgumentError = require('../error/MissingArgumentError');

module.exports = class InterfaceDescription {
  constructor(name, typedProperties, inherits) {
    this.name = name;
    this.typedProperties = typedProperties;
    this.inherits = inherits;

    if (!this.name) {
      throw new MissingArgumentError('name');
    } else if (!this.typedProperties) {
      throw new MissingArgumentError('typedProperties');
    }

    if (!this.inherits && this.name === `${this.name}`.toUpperCase()) {
      this.inherits = "Node";
    }
  }

  get imports() {
    const defaultTypes = ["Number", "String", "Boolean", "Map"];
    return this.uniqueTypes
      .filter(type => defaultTypes.indexOf(type) < 0)
      .map(type => `import ${type} from "./${type}";`)
      .join("\n")
  }

  get uniqueTypes() {
    try {
      return arrayToUnique([
        this.inherits,
        ...(this.typedProperties || []).map(property => property.type.split("[")[0])
      ]
        .map(type => type && type.split("<").join(", ").split(">").join("").split(", "))
        .flat()
        .filter(type => !!type));
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  get interfaceDeclaration() {
    return `export default interface ${this.name} ${this.inherits ? `extends ${this.inherits}` : ""}`
  }

  get interfaceProperties() {
    return this.typedProperties
      .map(prop => `${prop.name}: ${prop.type};`)
      .join("\n  ");
  }

  get typeFileString() {
    return `
${this.imports}

${this.interfaceDeclaration} {
  ${this.interfaceProperties}
}`
  }
}