function resolve(input) {
	return require.resolve(input)
}

function loadJson(path) {
	return require(path)
}

module.exports = { resolve, loadJson }
