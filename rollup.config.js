/**
 * build for cjs
 */

import fs from 'fs-extra'
import path from 'path'
import babel from '@rollup/plugin-babel'
import common from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'

const hooksPath = path.join(__dirname, './src')
const distPath = path.join(__dirname, './dist/cjs')

const extensions = ['.js', '.ts']
const external = ['vue', '@babel/runtime']

const plugins = [
  babel({
    exclude: 'node_modules/**',
    extensions,
    babelHelpers: 'runtime',
    presets: ['@babel/preset-env', '@babel/preset-typescript'],
    plugins: ['@babel/plugin-transform-runtime'],
  }),
  nodeResolve({
    browser: true,
    extensions,
  }),
  common(),
]

const cjsOutput = {
  format: 'cjs',
  exports: 'named',
  entryFileNames: '[name]/index.js',
  dir: distPath,
}

export default (async () => {
  const files = await fs.readdir(hooksPath)
  const hooks = await Promise.all(
    files.map(async (name) => {
      const comPath = path.join(hooksPath, name)
      const entry = path.join(comPath, './index.ts')
      const stat = await fs.stat(comPath)
      if (!stat.isDirectory()) return null
      const hasFile = await fs.pathExists(entry)
      if (!hasFile) return null
      return { name: name, url: entry }
    })
  )

  return [
    ...hooks
      .filter((r) => r)
      .map(({ name, url }) => ({
        input: { [name]: url },
        output: [cjsOutput],
        external,
        plugins,
      })),
    {
      input: { index: path.join(hooksPath, 'index.ts') },
      output: [
        {
          ...cjsOutput,
          entryFileNames: 'index.js',
        },
      ],
      external,
      plugins,
    },
  ]
})()
