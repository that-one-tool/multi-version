import { accessSync, constants, promises as fs } from 'node:fs';
import { cwd } from 'node:process';
import { LogStatus } from '../types.js';
import { ReadFileError, WriteFileError } from './errors.js';
import * as Logger from './logger.js';

export function isFileAccessible(path: string) {
	try {
		accessSync(path, constants.R_OK || constants.W_OK);
		Logger.verbose(LogStatus.Valid, `File ${path} can be accessed`);
		return true;
	} catch {
		Logger.verbose(LogStatus.Invalid, `File ${path} cannot be accessed`);
		return false;
	}
}

export async function readFile(path: string): Promise<string> {
	try {
		Logger.verbose(LogStatus.None, `Reading file ${path}`);

		const file = await fs.readFile(path, { encoding: 'utf-8' });

		Logger.verbose(LogStatus.Valid, `File ${path} read`);
		return file;
	} catch (error) {
		throw new ReadFileError(`Cannot read the file: ${path}`, { cause: error });
	}
}

export async function writeFile(path: string, data: string): Promise<void> {
	try {
		Logger.verbose(LogStatus.None, `Writing file ${path}`);

		await fs.writeFile(path, data, { encoding: 'utf-8' });

		Logger.verbose(LogStatus.Valid, `File ${path} written`);
	} catch (error) {
		throw new WriteFileError(`Cannot write the file: ${path}`, { cause: error });
	}
}

export function getPackageFromRelativePath(path: string) {
	return `${cwd()}/${path}`;
}
