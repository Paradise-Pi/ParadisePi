/* eslint-disable */
const { copyFileSync, existsSync, mkdirSync } = require('fs')
const path = require('path')
const { resolve } = require('path')
const { readdir } = require('fs').promises
/**
 * Runs through the main project looking for Markdown and puts it in the docs folder
 */

//https://stackoverflow.com/a/45130990/3088158
async function* getFiles(dir) {
	const dirents = await readdir(dir, { withFileTypes: true })
	for (const dirent of dirents) {
		const res = resolve(dir, dirent.name)
		if (dirent.isDirectory()) {
			yield* getFiles(res)
		} else {
			yield res
		}
	}
}
console.log('Copying docs from Markdown folder over to docs folder for docusaurus')
;(async () => {
	for await (const f of getFiles(path.join(__dirname, '/../src/'))) {
		if (path.basename(f).endsWith('.md') || path.basename(f) === '_category_.yml') {
			if (path.basename(f).toLowerCase() === 'readme.md') {
				f.replace(path.basename(f), 'index.md')
			}
			const newPath = f.replace(path.join(__dirname, '/../src/'), path.join(__dirname, '/docs/repo-docs/'))
			if (!existsSync(path.dirname(newPath))) {
				mkdirSync(path.dirname(newPath), { recursive: true })
			}
			copyFileSync(f, newPath)
			console.log('Copied file ' + f.replace(path.join(__dirname, '/../src/'), '') + ' to docs/repo-docs/')
		}
	}
})()
console.log('Completed copying docs')
