import path from "path";
import {Configuration} from "webpack";

const config: Configuration = {
  mode: 'production',
  entry: './src/index.ts',
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
    extensions: ['.ts'],
    alias: {
      lib: path.resolve(__dirname, 'src/lib/')
    },
  },
  output: {
    library: {
      name: 'Matcher',
      type: 'window'
    },
    filename: 'index.js',
    path: path.resolve(__dirname, 'build/')
  },
};

export default config
