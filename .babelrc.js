console.log('Load babel config');

module.exports = {
  presets: [
    ["@babel/preset-typescript"],
    [
      '@babel/preset-env',
      {
        loose:true,
        modules: false,
      },
    ],
  ],

  "plugins": [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread"
  ],

  env: {
    test: {
      presets: [
        ["@babel/preset-typescript"],
        [
          '@babel/preset-env',
          {
            targets: {
              node: true,
            },
          },
        ],
      ]
    },
  },
};
