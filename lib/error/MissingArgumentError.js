module.exports = class MissingArgumentError extends Error {
  constructor(argumentName) {
    super(`Failed, argument with name '${argumentName}' missing`)
  }
}