import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const SCRIPTS_PACKAGE_JSON_PATH = path.join(__dirname, '../../package.json')
export const TARGET_PACKAGE_JSON_PATH = path.join(process.cwd(), './package.json')

export async function readScriptsPackageJson(): Promise<any> {
	return readPackageJson(SCRIPTS_PACKAGE_JSON_PATH)
}

export async function readTargetPackageJson(): Promise<any> {
	return readPackageJson(TARGET_PACKAGE_JSON_PATH)
}

async function readPackageJson(pkgPath: string) {
	const data = await fs.readFile(pkgPath, 'utf-8')
	return JSON.parse(data)
}
