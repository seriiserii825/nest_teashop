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
            getCustomTransformers: (program) => {
              const nestiaCore = require('@nestia/core/lib/transform');
              const nestiaSdk = require('@nestia/sdk/lib/transform');
              const typia = require('typia/lib/transform');

              return {
                before: [
                  nestiaCore.default(program, { validate: 'validate', stringify: 'assert' }),
                  nestiaSdk.default(program),
                  typia.default(program, {}),
                ],
              };
            },
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
