import { tsJob } from "./tsJob"

/**
 * Compiles typescript from src/ to the lib/ folder
 * @param configFile The tsconfig.json path
 * @param verbose verbose mode
 */
export async function compileTypescript(configFile: string, verbose: boolean): Promise<void> {
  return tsJob({
    configFile,
    verbose,
    dest: 'lib',
    title: 'tsc'
  })
}

