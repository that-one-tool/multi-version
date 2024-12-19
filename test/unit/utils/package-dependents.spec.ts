import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import { LogLevel, MarkedPackage } from '../../../src/types';
import { getFlattenDependentTable } from '../../../src/utils/package-dependents';

globalThis.LOG_LEVEL = LogLevel.Verbose;

describe('getFlattenDependentTable', () => {
	it('should return an empty object if packageMap is empty', () => {
		const packageMap = {};
		const expected = {};

		assert.deepStrictEqual(getFlattenDependentTable(packageMap), expected);
	});

	it('should return a flatten dependent table', () => {
		const packageMap = {
			'package-1': {
				version: '1.0.0',
				path: 'packages/package-1',
				shouldBeUpdated: false,
				pkg: {
					packageJson: {
						name: 'package-1',
						dependencies: {
							'package-2': '1.0.0',
							'package-3': '1.0.0',
						},
					},
				},
			},
			'package-2': {
				version: '1.0.0',
				path: 'packages/package-2',
				shouldBeUpdated: false,
				pkg: {
					packageJson: {
						name: 'package-2',
						dependencies: {},
					},
				},
			},
			'package-3': {
				version: '1.0.0',
				path: 'packages/package-3',
				shouldBeUpdated: false,
				pkg: {
					packageJson: {
						name: 'package-3',
						dependencies: {
							'package-4': '1.0.0',
						},
					},
				},
			},
			'package-4': {
				version: '1.0.0',
				path: 'packages/package-4',
				shouldBeUpdated: false,
				pkg: {
					packageJson: {
						name: 'package-4',
						dependencies: {
							'package-5': '1.0.0',
						},
					},
				},
			},
			'package-5': {
				version: '1.0.0',
				path: 'packages/package-5',
				shouldBeUpdated: false,
				pkg: {
					packageJson: {
						name: 'package-5',
						dependencies: {
							'package-2': '1.0.0',
						},
					},
				},
			},
		} as unknown as Record<string, MarkedPackage>;
		const expected = {
			'package-1': [],
			'package-2': ['package-1', 'package-5', 'package-4', 'package-3'],
			'package-3': ['package-1'],
			'package-4': ['package-3', 'package-1'],
			'package-5': ['package-4', 'package-3', 'package-1'],
		};

		const actual = getFlattenDependentTable(packageMap);

		assert.deepStrictEqual(actual, expected);
	});
});
