import { ReleaseType } from 'semver';
import { PackageJSON } from '../types.js';
import { MultiVersionError } from '../utils/errors.js';
import { isFileAccessible, readFile, writeFile } from '../utils/files.js';
import { incrementVersionForReleaseType } from '../utils/versions.js';

export class PackageVersioner {
	private packageJson: PackageJSON | null;
	private filePath: string;

	constructor(
		private packageName: string,
		private packagePath: string,
	) {
		this.filePath = `${this.packagePath}${this.packageName}`;
		this.packageJson = null;
	}

	/**
	 * Update package version given the provided release type and return the new version
	 *
	 * @param {ReleaseType} releaseType The release type
	 * @param {boolean} updateFile Whether the package.json file should updated or not. Default to false.
	 * @returns {string} A promise resolving to the new package version
	 */
	async updatePackageVersion(releaseType: ReleaseType, updateFile?: boolean): Promise<string> {
		await this.loadPackageJsonFileData();

		if (!this.packageJson?.version) {
			throw new MultiVersionError(`package.json version for package ${this.packageName} not found`);
		}

		const currentVersion = this.packageJson.version;
		const newVersion = incrementVersionForReleaseType(currentVersion, releaseType);

		if (updateFile) {
			await this.updatePackageJsonFileData(newVersion);
		}

		return newVersion;
	}

	private async loadPackageJsonFileData(): Promise<void> {
		if (!isFileAccessible(this.filePath)) {
			throw new MultiVersionError(`package.json for package ${this.packageName} not found or inaccessible`);
		}

		const data = await readFile(this.filePath);

		this.packageJson = JSON.parse(data) as PackageJSON;
	}

	private async updatePackageJsonFileData(newVersion: string): Promise<void> {
		if (this.packageJson === null) {
			throw new MultiVersionError(`package.json data for package ${this.packageName} is null`);
		}

		this.packageJson.version = newVersion;
		const newData = JSON.stringify(this.packageJson);

		await writeFile(this.filePath, newData);
	}
}
