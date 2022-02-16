const babelOptions = {
  presets: ["babel-preset-gatsby"],
}

const babelJestMd = require("babel-jest")
const babelJest = babelJestMd.__esModule ? babelJestMd.default : babelJestMd

module.exports = babelJest.createTransformer(babelOptions)
