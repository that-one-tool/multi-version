import { LogStatus } from '../types.js';
import { execAsync } from './commands.js';
import { InvalidCommitError } from './errors.js';
import * as Logger from './logger.js';

export async function checkoutBranch(branchName: string): Promise<void> {
	await execAsync(`git checkout ${branchName.replace('origin/', '')}`);
}

export async function fetchOrigin(): Promise<void> {
	await execAsync('git fetch origin');
}

export async function getBranchList(): Promise<string> {
	return await execAsync('git branch');
}

export async function getChangedFiles(commitShortSha: string, baseBranch: string): Promise<string[]> {
	let result;

	try {
		result = await execAsync(`git diff-tree -r --no-commit-id --name-only ${commitShortSha}`);
	} catch (error) {
		Logger.warn(LogStatus.Warning, `Failed to get changed files from commit ${commitShortSha}: ${error}`);
	}

	if (result) {
		return result.split('\n');
	}

	try {
		result = await execAsync(`git diff --name-only ${baseBranch.replace('origin/', '')}...HEAD`);
	} catch (error) {
		Logger.error(LogStatus.Warning, `Failed to get changed files from diff with ${baseBranch}: ${error}`);
	}

	if (result) {
		return result.split('\n');
	}

	throw new InvalidCommitError('Unable to get changed files');
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

export async function pullBranch(branchName: string): Promise<void> {
	await execAsync(`git fetch`);
	await execAsync(`git pull origin ${branchName.replace('origin/', '')}`);
}
