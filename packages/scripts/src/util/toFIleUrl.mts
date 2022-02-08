import url from 'url'
import path from 'path'

export function toFileUrl(...parts: string[]): string {
	return url.pathToFileURL(path.join(...parts)).href
}
