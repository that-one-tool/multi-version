import * as assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { SemVer } from 'semver';
import { LogLevel } from '../../../src/types';
import { InvalidVersionError } from '../../../src/utils/errors';
import { incrementVersionForReleaseType } from '../../../src/utils/versions';

globalThis.LOG_LEVEL = LogLevel.Quiet;

describe('incrementVersionForReleaseType', () => {
	it('should increment version for major release type', () => {
		const actual = incrementVersionForReleaseType('1.2.3', 'major');
		assert.strictEqual(actual, '2.0.0');
	});

	it('should increment version for minor release type', () => {
		const actual = incrementVersionForReleaseType('1.2.3', 'minor');
		assert.strictEqual(actual, '1.3.0');
	});

	it('should increment version for patch release type', () => {
		const actual = incrementVersionForReleaseType('1.2.3', 'patch');
		assert.strictEqual(actual, '1.2.4');
	});

	it('should not increment the version is release type is null', () => {
		const actual = incrementVersionForReleaseType('1.2.3', null);
		assert.strictEqual(actual, '1.2.3');
	});

	it('should throw an error if original version is invalid', () => {
		const result = () => incrementVersionForReleaseType('invalid', 'major');
		assert.throws(result, InvalidVersionError);
	});

	it('should throw an error if semver new version is invalid', () => {
		mock.method(SemVer.prototype, 'inc', () => {
			throw new Error();
		});

		const result = () => incrementVersionForReleaseType('1.2.3', 'major');

		assert.throws(result, InvalidVersionError);
	});
});
