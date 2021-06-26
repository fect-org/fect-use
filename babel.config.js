module.exports = function (api, options = {}) {
  if (api) api.cache.never()
  const { BABEL_MODULE } = process.env
  const isESModules = BABEL_MODULE !== 'commonjs'
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: isESModules ? false : 'commonjs',
          loose: options.loose,
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        { corejs: false, helpers: true, useESModules: isESModules },
      ],
    ],
  }
}
