import { ReleaseType, SemVer, valid } from 'semver';
import { LogStatus } from '../types.js';
import { InvalidVersionError } from '../utils/errors.js';
import * as Logger from '../utils/logger.js';

export function incrementVersionForReleaseType(originalVersion: string, releaseType: ReleaseType | null): string {
	if (releaseType === null) {
		Logger.debug(LogStatus.Warning, 'No update performed on version');
		return originalVersion;
	}

	if (!valid(originalVersion)) {
		Logger.verbose(LogStatus.Invalid, 'Invalid SemVer version');
		throw new InvalidVersionError(`Invalid SemVer version: ${originalVersion}`);
	}

	let newVersion: string;

	try {
		newVersion = new SemVer(originalVersion).inc(releaseType).toString();
	} catch (error) {
		Logger.verbose(LogStatus.Invalid, 'Invalid SemVer new version');
		throw new InvalidVersionError(`Invalid SemVer version ${originalVersion} for release type ${releaseType}`, { cause: error });
	}

	Logger.info(LogStatus.Valid, `Version incremented: ${originalVersion} -> ${newVersion} (${releaseType})`);
	return newVersion;
}
