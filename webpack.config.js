const path = require(`path`);
const slsw = require(`serverless-webpack`);
const nodeExternals = require(`webpack-node-externals`);
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const outDir = path.join(__dirname, `dist`);

const isLocal = slsw.lib.webpack.isLocal;

module.exports = {
  entry: slsw.lib.entries,
  target: `node`,
  mode: isLocal ? "development" : "production",
  externals: [nodeExternals()],
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".json", ".ts"],
    symlinks: false,
    cacheWithContext: false,
  },
  output: {
    libraryTarget: `commonjs`,
    path: outDir,
    filename: `[name].js`,
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: [
          [
            path.resolve(__dirname, "node_modules"),
            path.resolve("..", __dirname, ".serverless"),
            path.resolve(__dirname, ".dist"),
          ],
        ],
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: "write-references",
      },
    }),
  ],
};
