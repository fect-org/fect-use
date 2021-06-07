module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: true,
        useESModules: true,
      },
    ],
  ],
  ignore: [/@babel[\\|/]runtime/],
}
