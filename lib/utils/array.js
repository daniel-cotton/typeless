
function arrayToUnique(arr) {
  return Object.keys(arr.reduce((out, item) => ({
    ...out,
    [item]: true
  }), {}))
}

module.exports = {
  arrayToUnique
}