import fs from 'fs'
import path from 'path'
// eslint-disable-next-line no-var-requires
const jszip = require('jszip')

describe('zipped archives', () => {
	it('can unpack a flat star glob', async () => {
		const entries = await readZip('data.zip')
		assertZipIs(entries, 'x.json', 'y.json', 'z.json', 'foo/')
	})

	it('can unpack a recursive star glob', async () => {
		const entries = await readZip('data2.zip')
		assertZipIs(
			entries,
			'x.json',
			'y.json',
			'z.json',
			'foo/',
			'foo/derp.json',
			'foo/bar/',
			'foo/bar/herp.json',
		)
	})

	it('can unpack multiple specs', async () => {
		const entries = await readZip('data3.zip')
		assertZipIs(
			entries,
			'x.json',
			'y.json',
			'z.json',
			'foo/derp.json',
			'foo/bar/herp.json',
		)
	})

	it('can work without a base path', async () => {
		const entries = await readZip('data4.zip')
		assertZipIs(
			entries,
			'data/x.json',
			'data/y.json',
			'data/z.json',
			'data/foo/derp.json',
			'data/foo/bar/herp.json',
		)
	})

	it('can unpack a folder', async () => {
		const entries = await readZip('data5.zip')
		assertZipIs(entries, 'foo/derp.json', 'foo/bar/herp.json')
	})
})

function assertZipIs(entries: string[], ...expected: string[]) {
	expected.forEach(e => expect(entries).toContain(e))
	entries.forEach(e => expect(expected).toContain(e))
}

function readZip(file: string): Promise<string[]> {
	return readEntries(path.join(__dirname, '../../dist', file))
}

async function readEntries(file: string): Promise<string[]> {
	const data = await readFileData(file)
	const content = await jszip.loadAsync(data)
	return Object.keys(content.files)
}

function readFileData(file: string): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		fs.readFile(file, (err, res) => {
			if (err) {
				reject(err)
			} else {
				resolve(res)
			}
		})
	})
}
