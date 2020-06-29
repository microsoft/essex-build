import { tsJob } from "./tsJob";

/**
 * Emits typings files into dist/typings
 * @param configFile The tsconfig.json path
 * @param verbose verbose mode
 */
export async function emitTypings(configFile: string, verbose: boolean): Promise<void> {
  return tsJob({
    configFile,
    verbose,
    dest: 'dist/typings',
    title: 'typings',
    overrides: {
      declaration: true,
      emitDeclarationOnly: true,
      stripInternal: true  
    }
  })
}