
import { Application, TSConfigReader, TypeDocReader, TypeDocAndTSOptions } from 'typedoc'
import { getPackageJSON, getReadmePath } from '../utils'
import { existsSync } from 'fs'
import { subtaskSuccess, subtaskFail } from '../utils/log'



export async function generateTypedocs(verbose: boolean): Promise<void> {
	const { title, name} = (await getPackageJSON()) as {title?: string, name: string}
  const readmeFile = await getReadmePath()
  try {
    await typedoc({
        name: title || name || 'API Documentation',
        entryPoint: 'src/index.ts',
        excludeExternals: true,
        excludeNotExported: true,
        exclude: ['**/__tests__/**', '**/node_modules/**'],
        excludePrivate: true,
        out: 'dist/docs',
        logger: 'none',
        readme: existsSync(readmeFile) ? readmeFile : undefined,
    })
    subtaskSuccess('typedoc')
  } catch (err) {
    console.error(err)
    subtaskFail('typedoc')
  }
}

/**
 * Generate TypeDoc documentation
 * @param options TypeDoc options
 */
async function typedoc(options: Partial<TypeDocAndTSOptions>): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const app = new Application();
      app.options.addReader(new TSConfigReader());
      app.options.addReader(new TypeDocReader());
      app.bootstrap(options);
      const src = app.expandInputFiles(['src/index.ts'])
      app.generateDocs(src, 'dist/docs')
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}