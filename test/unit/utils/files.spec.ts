import * as assert from 'node:assert';
import * as fs from 'node:fs';
import { describe, it, mock } from 'node:test';
import { LogLevel } from '../../../src/types';
import { ReadFileError, WriteFileError } from '../../../src/utils/errors';
import { getPackageFromRelativePath, isFileAccessible, readFile, writeFile } from '../../../src/utils/files';

globalThis.LOG_LEVEL = LogLevel.Verbose;

describe('Files', () => {
	it('isFileAccessible should return true for accessible files', () => {
		const path = './test/unit/utils/test-read-file.txt';

		assert.strictEqual(isFileAccessible(path), true);
	});

	it('isFileAccessible should return false for inaccessible files', () => {
		const path = './test/unit/utils/non-existent-file.txt';

		assert.strictEqual(isFileAccessible(path), false);
	});

	it('readFile should return file content', async () => {
		const path = './test/unit/utils/test-read-file.txt';

		const content = await readFile(path);

		assert.strictEqual(content, 'FILE CONTENT');
	});

	it('readFile should throw ReadFileError for non-existent files', async () => {
		const path = './test/unit/utils/non-existent-file.txt';

		await assert.rejects(() => readFile(path), ReadFileError);
	});

	it('writeFile should write data to file', async () => {
		const path = './test/unit/utils/test-write-file.txt';

		await writeFile(path, 'Test content');

		const content = fs.readFileSync(path, 'utf-8');
		assert.strictEqual(content, 'Test content');
		fs.unlinkSync(path);
	});

	it('writeFile should throw WriteFileError for invalid files', async () => {
		const path = './test/unit/utils/test-write-file.txt';
		mock.method(fs.promises, 'writeFile', () => {
			throw new Error('Test error');
		});

		await assert.rejects(() => writeFile(path, 'Test content'), WriteFileError);
	});

	it('getPackageFromRelativePath should return correct path', () => {
		const relativePath = './test/unit/utils/test-read-file.txt';

		const expectedPath = `${process.cwd()}/${relativePath}`;

		assert.strictEqual(getPackageFromRelativePath(relativePath), expectedPath);
	});
});
