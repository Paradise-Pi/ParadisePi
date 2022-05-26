/* eslint-disable */
const { copyFileSync, existsSync, mkdirSync, rmSync } = require('fs')
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
if (existsSync(path.join(__dirname, '/docs/repo-docs'))) {
  // Remove existing folder, as it might be that this is populated with old docs
	console.log('Cleaning old docs')
  rmSync(path.join(__dirname, '/docs/repo-docs/'), { recursive: true, force: true });
}
;(async () => {
	for await (const f of getFiles(path.join(__dirname, '/../src/'))) {
		if (path.basename(f).endsWith('.md') || path.basename(f) === '_category_.yml') {
			let newPath = f.replace(path.join(__dirname, '/../src/'), path.join(__dirname, '/docs/repo-docs/'))
			if (path.basename(f).toLowerCase() === 'readme.md') {
				newPath = newPath.replace(path.basename(newPath), 'index.md')
			}
			if (!existsSync(path.dirname(newPath))) {
				mkdirSync(path.dirname(newPath), { recursive: true })
			}
			copyFileSync(f, newPath)
			console.log('Copied file ' + f.replace(path.join(__dirname, '/../src/'), '') + ' to docs/repo-docs/')
		}
	}
})()
