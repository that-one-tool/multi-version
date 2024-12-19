import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { MultiVersionError } from './errors.js';

export async function execAsync(command: string): Promise<string> {
	let stdout;
	let stderr;

	try {
		const result = await promisify(exec)(command, { maxBuffer: 1024 * 1024 * 10 });
		stdout = result.stdout;
		stderr = result.stderr;
	} catch (error) {
		throw new MultiVersionError(`Error while executing the command:\n==> ${command}`, { cause: error });
	}

	if (stderr) {
		throw new MultiVersionError(stderr, { cause: new MultiVersionError(`Error while executing the command:\n==> ${command}`) });
	}

	return stdout;
}
