import { getPackages, Packages } from '@manypkg/get-packages';
import { cwd } from 'node:process';
import { ReleaseType } from 'semver';
import { CommitAnalyzer } from '../handlers/commit-analyzer.js';
import { Config, LogStatus, MarkedPackage } from '../types.js';
import { InvalidConfigError, InvalidVersionBumpError } from '../utils/errors.js';
import { checkoutBranch, fetchOrigin, pullBranch } from '../utils/git.js';
import * as Logger from '../utils/logger.js';
import { getFlattenDependentTable } from '../utils/package-dependents.js';
import { incrementVersionForReleaseType } from '../utils/versions.js';

export class Versioner {
	private commitAnalyzer: CommitAnalyzer;
	private expectedSyncedVersion: string | null = null;
	private packageDictionary: Record<string, MarkedPackage> = {};
	private changedPackageNames: string[] = [];
	private releaseType: ReleaseType | null = null;

	constructor(private config: Config) {
		this.commitAnalyzer = new CommitAnalyzer();
	}

	async initialize(): Promise<void> {
		Logger.debug(LogStatus.None, `Config loaded: ${JSON.stringify(this.config)}`);

		await this.commitAnalyzer.loadCommit();

		this.releaseType = await this.commitAnalyzer.getReleaseType();
		Logger.info(LogStatus.Important, `Release type: ${this.releaseType}`);
	}

	async bumpVersions(): Promise<void> {
		await this.initialize();

		throw new Error('Not implemented');
	}

	async validateVersions(): Promise<void> {
		await this.initialize();

		await this.findChangedPackagesAndMarkUpdateStatus();

		await this.pullBaseBranch();

		const { packages: originalPackages } = await this.getPackages();

		for (const [pkgName, markedPackage] of Object.entries(this.packageDictionary)) {
			const originalVersion = originalPackages.find((_pkg) => _pkg.packageJson.name === pkgName)?.packageJson.version;
			this.checkPackageVersioning(pkgName, markedPackage.shouldBeUpdated, originalVersion);
		}
	}

	private async findChangedPackagesAndMarkUpdateStatus(): Promise<void> {
		Logger.debug(LogStatus.None, 'Finding changed packages and marking their update status...');

		const { packages } = await this.getPackages();

		for (const pkg of packages) {
			this.packageDictionary[pkg.packageJson.name] = {
				pkg,
				version: pkg.packageJson.version,
				path: Versioner.makeCleanPackagePath(pkg.relativeDir),
				shouldBeUpdated: !!this.config?.syncedMode,
			};
		}

		const changedFilePaths = await this.commitAnalyzer.getChangedFilesPaths();
		this.changedPackageNames = this.getChangedPackageNames(changedFilePaths);

		if (this.config?.syncedMode) {
			this.expectedSyncedVersion = this.packageDictionary[packages[0].packageJson.name]?.version ?? null;
			Logger.info(LogStatus.Important, `Expected synced version: ${this.expectedSyncedVersion}`);
		}

		if (!this.config?.syncedMode) {
			this.markPackagesUpdateStatus();
		}

		Logger.verbose(LogStatus.None, 'Packages marked');
	}

	private getChangedPackageNames(changedFilePaths: string[]): string[] {
		const foundPackages: string[] = [];
		const remainingPackages = structuredClone(this.packageDictionary);

		for (const changedFilePath of changedFilePaths) {
			for (const packageName of Object.keys(remainingPackages)) {
				const packagePath = remainingPackages[packageName]?.path;

				if (packagePath && changedFilePath.includes(packagePath)) {
					foundPackages.push(packageName);
					delete remainingPackages[packageName];
				}
			}

			if (Object.keys(remainingPackages).length === 0) {
				break;
			}
		}

		return foundPackages;
	}

	private markPackagesUpdateStatus(): void {
		Logger.verbose(LogStatus.None, `Marking packages update status...`);

		const flattenDependentsTable = getFlattenDependentTable(this.packageDictionary);

		for (const packageName of Object.keys(this.packageDictionary)) {
			this.packageDictionary[packageName].shouldBeUpdated =
				this.changedPackageNames.includes(packageName) || this.packageDictionary[packageName].shouldBeUpdated || false;

			Logger.debug(
				LogStatus.None,
				`Package ${packageName} should be updated: ${this.packageDictionary[packageName].shouldBeUpdated}`,
			);

			for (const dep of flattenDependentsTable[packageName]) {
				Logger.verbose(LogStatus.None, `Package ${dep} is a dependent of package ${packageName}`);

				if (this.packageDictionary[packageName].shouldBeUpdated) {
					Logger.verbose(LogStatus.None, `Package ${dep} should be updated: true`);
					this.packageDictionary[dep].shouldBeUpdated = true;
				}
			}
		}
	}

	private checkPackageVersioning(packageName: string, shouldBeUpdated: boolean, originalVersion?: string): void {
		const actualNewVersion = this.packageDictionary[packageName]?.version;

		if (!actualNewVersion) {
			Logger.info(LogStatus.Skip, 'Package has been removed by this commit, version validation will be skipped', packageName);
			return;
		}

		if (!originalVersion && !this.config?.syncedMode) {
			Logger.info(
				LogStatus.Skip,
				'Package has been added by this commit (Synced mode OFF), version validation will be skipped',
				packageName,
			);
			return;
		}

		let expectedNewVersion = originalVersion ?? null;

		if (shouldBeUpdated) {
			expectedNewVersion =
				!originalVersion || this.config?.syncedMode
					? this.expectedSyncedVersion
					: incrementVersionForReleaseType(originalVersion, this.releaseType);
		}

		if (!expectedNewVersion) {
			Logger.error(LogStatus.Error, 'Expected version is null (Synced mode ON)', packageName);
			throw new InvalidVersionBumpError(`Expected version is null (Synced mode ON)`);
		}

		if (actualNewVersion != expectedNewVersion) {
			Logger.error(LogStatus.Error, 'Commited version does not correspond to expected version for release type', packageName);
			throw new InvalidVersionBumpError(
				`Commited version ${actualNewVersion} does not match expected ${expectedNewVersion} for release type ${this.releaseType ?? ''}: ${packageName}`,
			);
		}

		Logger.info(LogStatus.Success, `Package properly versioned: ${originalVersion ?? ''} -> ${expectedNewVersion}!`, packageName);
	}

	private async getPackages(): Promise<Packages> {
		Logger.debug(LogStatus.None, 'Getting packages from file system...');
		return await getPackages(cwd());
	}

	private async pullBaseBranch(): Promise<void> {
		if (!this.config?.baseBranch) {
			throw new InvalidConfigError('Base branch must be defined');
		}

		Logger.debug(LogStatus.None, `Pulling base branch ${this.config.baseBranch}...`);

		await checkoutBranch(this.config.baseBranch);
		await pullBranch(this.config.baseBranch);

		Logger.debug(LogStatus.None, 'Base branch pulled');
	}

	private static makeCleanPackagePath(relativeDir: string): string {
		let cleanPath = relativeDir;

		if (cleanPath.startsWith('/')) {
			cleanPath = cleanPath.slice(1);
		}

		if (cleanPath.startsWith('./')) {
			cleanPath = cleanPath.slice(2);
		}

		if (cleanPath.endsWith('/')) {
			cleanPath = cleanPath.slice(0, cleanPath.length - 1);
		}

		return cleanPath;
	}
}
