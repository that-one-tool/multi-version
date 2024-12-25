import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { MultiVersionError } from './errors.js';
import * as Logger from './logger.js';
import { LogStatus } from '../types.js';

export async function execAsync(command: string): Promise<string> {
	let stdout;
	let stderr;

	try {
		Logger.verbose(LogStatus.None, `Executing command ${command}`);
		const result = await promisify(exec)(command, { maxBuffer: 1024 * 1024 * 10 });
		stdout = result.stdout.trim();
		stderr = result.stderr.trim();
	} catch (error) {
		Logger.error(LogStatus.Error, `Failed to execute command ${command}: ${error}`);
		throw new MultiVersionError(`Error while executing the command:\n==> ${command}`, { cause: error });
	}

	if (stderr) {
		Logger.error(LogStatus.Error, `Command ${command} failed: ${stderr}`);
		throw new MultiVersionError(stderr, { cause: new MultiVersionError(`Error after executing the command:\n==> ${command}`) });
	}

	return stdout;
}
