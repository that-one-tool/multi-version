/* eslint-disable @typescript-eslint/dot-notation, @typescript-eslint/no-floating-promises */

import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import * as sinon from 'sinon';
import { Versioner } from '../../../src/commands/versioner';
import { Config, LogLevel } from '../../../src/types';

globalThis.LOG_LEVEL = LogLevel.Verbose;

describe('Versioner', () => {
	describe('validateVersions', () => {
		it('should throw an error if commit message is null', async () => {
			const config: Config = {
				baseBranch: 'main',
				syncedMode: false,
			};
			const versioner = new Versioner(config);

			const result = () => versioner.validateVersions();

			await assert.rejects(result);
		});

		it("should validate the packages' versions - syncedMode off", async () => {
			const config: Config = {
				baseBranch: 'main',
				syncedMode: false,
			};
			const versioner = new Versioner(config);
			const packagesNew = {
				packages: [
					{
						packageJson: {
							name: '@repo/app',
							version: '1.1.0',
							devDependencies: {
								'@repo/common': '*',
							},
						},
						relativeDir: './packages/app',
					},
					{
						packageJson: {
							name: '@repo/common',
							version: '1.1.0',
						},
						relativeDir: './packages/common',
					},
					{
						packageJson: {
							name: '@repo/app-2',
							version: '0.5.0',
						},
						relativeDir: './packages/app-2',
					},
					{
						packageJson: {
							name: '@repo/lib',
							version: '0.3.0',
							devDependencies: {
								'@repo/common': '*',
							},
						},
						relativeDir: './packages/lib',
					},
					{
						packageJson: {
							name: '@repo/app-3',
							version: '0.2.0',
							devDependencies: {
								'@repo/lib': '*',
							},
						},
						relativeDir: './packages/app-3',
					},
				],
			};
			const packagesOriginal = {
				packages: [
					{
						packageJson: {
							name: '@repo/app',
							version: '1.0.0',
							devDependencies: {
								'@repo/common': '*',
							},
						},
						relativeDir: './packages/app',
					},
					{
						packageJson: {
							name: '@repo/common',
							version: '1.0.0',
						},
						relativeDir: './packages/common',
					},
					{
						packageJson: {
							name: '@repo/app-2',
							version: '0.5.0',
						},
						relativeDir: './packages/app-2',
					},
					{
						packageJson: {
							name: '@repo/lib',
							version: '0.2.0',
							devDependencies: {
								'@repo/common': '*',
							},
						},
						relativeDir: './packages/lib',
					},
					{
						packageJson: {
							name: '@repo/app-3',
							version: '0.1.0',
							devDependencies: {
								'@repo/lib': '*',
							},
						},
						relativeDir: './packages/app-3',
					},
				],
			};
			// @ts-expect-error - Stub private method
			sinon.stub(versioner, 'getPackages').onFirstCall().resolves(packagesNew).onSecondCall().resolves(packagesOriginal);
			sinon.stub(versioner['commitAnalyzer'], 'loadCommit').resolves();
			sinon.stub(versioner['commitAnalyzer'], 'getReleaseType').resolves('minor');
			sinon.stub(versioner['commitAnalyzer'], 'getChangedFilesPaths').resolves(['./packages/common/index.ts']);
			// @ts-expect-error - Stub private method
			sinon.stub(versioner, 'pullBaseBranch').resolves();

			await versioner.validateVersions();

			assert.ok(true);
		});

		it("should validate the packages' versions - syncedMode on", async () => {
			const config: Config = {
				baseBranch: 'main',
				syncedMode: true,
			};
			const versioner = new Versioner(config);
			const packagesNew = {
				packages: [
					{
						packageJson: {
							name: '@repo/app',
							version: '1.1.0',
							devDependencies: {
								'@repo/common': '*',
							},
						},
						relativeDir: './packages/app',
					},
					{
						packageJson: {
							name: '@repo/common',
							version: '1.1.0',
						},
						relativeDir: './packages/common',
					},
					{
						packageJson: {
							name: '@repo/app-2',
							version: '1.1.0',
						},
						relativeDir: './packages/app-2',
					},
					{
						packageJson: {
							name: '@repo/lib',
							version: '1.1.0',
							devDependencies: {
								'@repo/common': '*',
							},
						},
						relativeDir: './packages/lib',
					},
					{
						packageJson: {
							name: '@repo/app-3',
							version: '1.1.0',
							devDependencies: {
								'@repo/lib': '*',
							},
						},
						relativeDir: './packages/app-3',
					},
				],
			};
			const packagesOriginal = {
				packages: [
					{
						packageJson: {
							name: '@repo/app',
							version: '1.0.0',
							devDependencies: {
								'@repo/common': '*',
							},
						},
						relativeDir: './packages/app',
					},
					{
						packageJson: {
							name: '@repo/common',
							version: '1.0.0',
						},
						relativeDir: './packages/common',
					},
					{
						packageJson: {
							name: '@repo/app-2',
							version: '0.5.0',
						},
						relativeDir: './packages/app-2',
					},
					{
						packageJson: {
							name: '@repo/lib',
							version: '0.2.0',
							devDependencies: {
								'@repo/common': '*',
							},
						},
						relativeDir: './packages/lib',
					},
					{
						packageJson: {
							name: '@repo/app-3',
							version: '0.1.0',
							devDependencies: {
								'@repo/lib': '*',
							},
						},
						relativeDir: './packages/app-3',
					},
				],
			};
			// @ts-expect-error - Stub private method
			sinon.stub(versioner, 'getPackages').onFirstCall().resolves(packagesNew).onSecondCall().resolves(packagesOriginal);
			sinon.stub(versioner['commitAnalyzer'], 'loadCommit').resolves();
			sinon.stub(versioner['commitAnalyzer'], 'getReleaseType').resolves('minor');
			sinon.stub(versioner['commitAnalyzer'], 'getChangedFilesPaths').resolves(['./packages/common/index.ts']);
			// @ts-expect-error - Stub private method
			sinon.stub(versioner, 'pullBaseBranch').resolves();

			await versioner.validateVersions();

			assert.ok(true);
		});
	});
});
