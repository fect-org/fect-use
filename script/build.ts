import { resolve } from 'path'
import { transformAsync } from '@babel/core'
import {
  readFileSync,
  outputFileSync,
  readdir,
  lstatSync,
  copy,
  remove,
} from 'fs-extra'

const srcDir = resolve(__dirname, '../src')
const esmDir = resolve(__dirname, '../dist/esm')
const cjsDir = resolve(__dirname, '../dist/cjs')

export type ModuleEnv = 'esmodule' | 'commonjs'

const setModuleEnv = (value: ModuleEnv) => (process.env.BABEL_MODULE = value)

const compile = (filepath: string) => {
  if (filepath.endsWith('.md')) return null
  return new Promise<void>((resolve, reject) => {
    const code = readFileSync(filepath, 'utf-8')
    transformAsync(code, { filename: filepath })
      .then(async (result: any) => {
        if (result) {
          const jsFilePath = filepath.replace(/\.\w+$/, '.js')
          await remove(filepath)
          outputFileSync(jsFilePath, result.code)
          resolve()
        }
      })
      .catch(reject)
  })
}

const compileDir = async (dir: string) => {
  const files = await readdir(dir)
  await Promise.all(
    files.map((name: string) => {
      const filePath = resolve(dir, name)
      if (lstatSync(filePath).isDirectory()) {
        return compileDir(filePath)
      }
      return compile(filePath)
    })
  )
}

export default (async () => {
  setModuleEnv('esmodule')
  await copy(srcDir, esmDir)
  await compileDir(esmDir)
  setModuleEnv('commonjs')
  await copy(srcDir, cjsDir)
  await compileDir(cjsDir)
})()
