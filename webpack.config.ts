import HtmlWebpackPlugin from "html-webpack-plugin";
import {resolve} from "path";
import {Configuration} from "webpack";

const env = process.env.NODE_ENV || 'development'

const entry = env === 'development' ? resolve('src/dev/index.ts') : resolve('/src/index.ts')
const mode = env === 'development' ? 'development' : 'production'
const plugins = env === 'development' ? [
  new HtmlWebpackPlugin({
    template: resolve('src/dev/index.html',)
  })
] : []

const config: Configuration = {
  mode,
  entry,
  target: ['web', 'es6'],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".wasm", ".ts", ".tsx", ".mjs", ".cjs", ".js", ".json"],
    alias: {
      lib: resolve(__dirname, 'src/lib/')
    },
  },
  output: {
    library: {
      name: 'Matcher',
      type: 'window'
    },
    filename: 'index.js',
    path: resolve(__dirname, 'build/')
  },
  plugins,
};

export default config
