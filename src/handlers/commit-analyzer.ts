import { Commit, CommitParser } from 'conventional-commits-parser';
import { Bumper } from 'conventional-recommended-bump';
import { ReleaseType } from 'semver';
import { LogStatus } from '../types.js';
import { InvalidCommitError } from '../utils/errors.js';
import { getChangedFiles, getCurrentCommitMessage, getCurrentCommitShortSha } from '../utils/git.js';
import * as Logger from '../utils/logger.js';

export class CommitAnalyzer {
	private commitMessage: string | null = null;
	private commit: Commit | null = null;
	private commitShortSha: string | null = null;

	async loadCommit(): Promise<void> {
		Logger.debug(LogStatus.None, 'Loading commit...');

		await this.setCommitMessage();
		await this.setCommitShortSha();

		this.parseCommit();

		Logger.debug(LogStatus.None, 'Commit loaded');
	}

	/**
	 * Get changed files paths from the commit
	 *
	 * @returns {string[]} The list of changed files paths
	 */
	async getChangedFilesPaths(): Promise<string[]> {
		Logger.debug(LogStatus.None, 'Getting changed files from commit...');

		if (this.commitShortSha === null) {
			throw new InvalidCommitError('Commit hash is invalid');
		}

		const changedFiles = await getChangedFiles(this.commitShortSha);
		const result: string[] = [];

		for (const changedFile of changedFiles) {
			const lastSlashIndex = changedFile.lastIndexOf('/');

			if (lastSlashIndex == -1) {
				// Ignore root files
				continue;
			}

			result.push(changedFile.substring(0, lastSlashIndex));
		}

		Logger.debug(LogStatus.None, 'Changed files paths retrieved');
		return result;
	}

	/**
	 * Get release type resulting from the commit message
	 *
	 * @returns {ReleaseType | null} A promise resolving to the release type, or `null` if it cannot be determined
	 */
	async getReleaseType(): Promise<ReleaseType | null> {
		Logger.debug(LogStatus.None, 'Getting release type from commit...');
		const bumper = new Bumper(process.cwd()).loadPreset('angular');
		const recommendation = await bumper.bump();

		Logger.debug(LogStatus.None, 'Release type retrieved');
		return !recommendation.releaseType ? null : (recommendation.releaseType as ReleaseType);
	}

	parseCommit(): void {
		Logger.debug(LogStatus.None, 'Parsing commit...');
		const parser = new CommitParser();

		if (this.commitMessage === null) {
			throw new InvalidCommitError('Commit message must be defined');
		}

		this.commit = parser.parse(this.commitMessage);
		Logger.debug(LogStatus.None, `Commit parsed. Type: ${this.commit.type}`);
	}

	private async setCommitMessage(): Promise<void> {
		this.commitMessage = await getCurrentCommitMessage();
		Logger.debug(LogStatus.None, `Commit message: ${this.commitMessage}`);

		if (!this.commitMessage) {
			throw new InvalidCommitError('Commit message is null');
		}
	}

	private async setCommitShortSha(): Promise<void> {
		this.commitShortSha = await getCurrentCommitShortSha();
	}
}
