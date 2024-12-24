import { execAsync } from './commands.js';

export async function getChangedFiles(commitShortSha: string): Promise<string[]> {
	const result = await execAsync(`git diff-tree -r --no-commit-id --name-only ${commitShortSha}`);
	return result.split('\n');
}

export async function getCurrentBranch(): Promise<string> {
	return await execAsync('git rev-parse --abbrev-ref HEAD');
}

export async function getCurrentCommitMessage(): Promise<string> {
	return await execAsync('git log --format=%B -n 1');
}

export async function getCurrentCommitShortSha(): Promise<string> {
	return await execAsync('git rev-parse --short HEAD');
}

export async function pullBranch(branch: string) {
	await execAsync(`git pull ${branch.includes('origin') ? branch : 'origin/' + branch}`);
}
