const path = require('path');

module.exports = function (options) {
  return {
    ...options,
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: false,
            compiler: 'ts-patch/compiler',
          },
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      ...(options.resolve || {}),
      extensions: ['.ts', '.js'],
      modules: [path.resolve(__dirname), 'node_modules'],
    },
  };
};
