
const { arrayToUnique } = require('../utils/array');
const MissingArgumentError = require('../error/MissingArgumentError');

/**
 * @typedef {Object} TypedProperty
 * @property {string} name the name of the property
 * @property {string} type the datatype of the property
 */

/**
 * A class describing an entity's interface, containing 
 * information about the name of the entity, it's properties
 * and it's inheritance.
 * 
 * This class provides getters to construct Typescript
 * interfaces as strings, from the object's contents.
 */
class InterfaceDescription {
  /**
   * A class describing an entity's interface, containing 
   * information about the name of the entity, it's properties
   * and it's inheritance.
   * 
   * This class provides getters to construct Typescript
   * interfaces as strings, from the object's contents.
   * 
   * @param {string} name 
   * @param {TypedProperty[]} typedProperties 
   * @param {string?} inherits 
   * 
   * @throws {MissingArgumentError} if name or typedProperties are missing, an error will be thrown.
   */
  constructor(name, typedProperties, inherits) {
    this.name = name;
    this.typedProperties = typedProperties;
    this.inherits = inherits;

    if (!this.name) {
      throw new MissingArgumentError('name');
    } else if (!this.typedProperties) {
      throw new MissingArgumentError('typedProperties');
    } else if (!this.inherits) {
      this.inherits = null;
    }

    if (!this.inherits && this.name === `${this.name}`.toUpperCase()) {
      this.inherits = "Node";
    }
  }

  /**
   * This getter returns a string of valid ESModule imports 
   * based on the types used by properties and inheritance
   * within this interface.
   * 
   * @returns {string} a valid string of ESModule imports for the types used by this module
   */
  get imports() {
    const defaultTypes = ["Number", "String", "Boolean", "Map"];
    return this.uniqueTypes
      .filter(type => defaultTypes.indexOf(type) < 0)
      .map(type => `import ${type} from "./${type}";`)
      .join("\n")
  }

  /**
   * This method returns an array of strings containing the
   * names of the unique data types leveraged by this 
   * interface.
   * 
   * @returns {string[]} an array of unique datatypes used in this interface
   */
  get uniqueTypes() {
    try {
      return arrayToUnique([
        this.inherits,
        ...(this.typedProperties || []).map(property => property.type.split("[")[0])
      ]
        .map(type => type && type.split("<").join(",").split(">").join("").split(","))
        .flat()
        .filter(type => !!type))
        .map(type => type.trim());
    } catch (e) {
      return [];
    }
  }

  /**
   * This method generates and returns the interface declaration
   * line of typescript for the described entity, including
   * extending an interface defined as inherited.
   * 
   * @returns {string} a valid typescript declaration string, defining an interface with potential inheritance.
   */
  get interfaceDeclaration() {
    return `interface ${this.name}${this.inherits ? ` extends ${this.inherits}` : ""}`
  }

  /**
   * This method generates a string consisting of valid
   * typescript, defining the properties that the entity
   * exposes.
   * 
   * @returns {string} a string of valid syntax for declaring typescript properties in an interface
   */
  get interfaceProperties() {
    return this.typedProperties
      .map(prop => `${prop.name}: ${prop.type};`)
      .join("\n  ");
  }

  /**
   * This method generates a string consisting of valid
   * typescript, defining a Typescript Interface including
   * imports, interface declaration, properties, inheritance
   * and default export of the interface.
   * 
   * @returns {string} a string that is valid code for a typescript interface file
   */
  get typeFileString() {
    return `${this.imports}

export default ${this.interfaceDeclaration} {
  ${this.interfaceProperties}
}`.trim()
  }
}

module.exports = InterfaceDescription;