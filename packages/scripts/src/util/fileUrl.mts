import url from 'url'
import path from 'path'

export function fileUrl(...parts: string[]): string {
	return url.pathToFileURL(path.join(...parts)).href
}
