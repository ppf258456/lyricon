// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodeExternals = require('webpack-node-externals');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ['webpack/hot/poll?100', options.entry],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({
        name: options.output.filename,
        autoRestart: true, // 自动重启
      }),
    ],
    devServer: {
      contentBase: path.join(__dirname, 'dist'), // 确保内容来自 dist 文件夹
      hot: true, // 启用热重载
      port: 3000, // 你的应用端口
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: ['style-loader', 'css-loader', 'ts-loader'], // 使用 ts-loader 来处理 TypeScript
          exclude: /node_modules/,
        },
      ],
    },
  };
};
