const MissingArgumentError = require('./MissingArgumentError');

test('constructs successfully, with appropriate message', () => {
  const error = new MissingArgumentError('argOne');
  expect(error.message).toStrictEqual(`Failed, argument with name 'argOne' missing`)
});