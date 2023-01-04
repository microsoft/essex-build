/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'
import jszip from 'jszip'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('zipped archives', () => {
	it('can unpack a flat star glob', async () => {
		const entries = await readZip('data.zip')
		expect(entries.length).toBeGreaterThan(0)
		assertZipIs(entries, 'x.json', 'y.json', 'z.json')
	})

	it('can unpack a recursive star glob', async () => {
		const entries = await readZip('data2.zip')
		expect(entries.length).toBeGreaterThan(0)
		assertZipIs(
			entries,
			'x.json',
			'y.json',
			'z.json',
			'foo/derp.json',
			'foo/bar/herp.json',
			'bar/.gitignore',
			'bar/linked_data/a',
			'bar/linked_data/b',
			'bar/linked_data/c',
		)
	})

	it('can unpack multiple specs', async () => {
		const entries = await readZip('data3.zip')
		expect(entries.length).toBeGreaterThan(0)
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
		expect(entries.length).toBeGreaterThan(0)
		assertZipIs(
			entries,
			'data/x.json',
			'data/y.json',
			'data/z.json',
			'data/foo/derp.json',
			'data/foo/bar/herp.json',
			'data/bar/.gitignore',
			'data/bar/linked_data/a',
			'data/bar/linked_data/b',
			'data/bar/linked_data/c',
		)
	})

	it('can unpack a folder', async () => {
		const entries = await readZip('data5.zip')
		expect(entries.length).toBeGreaterThan(0)
		assertZipIs(entries, 'foo/derp.json', 'foo/bar/herp.json')
	})
})

function assertZipIs(entries: string[], ...expected: string[]) {
	expected.forEach((e) => expect(entries).toContain(e))
	entries.forEach((e) => expect(expected).toContain(e))
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
