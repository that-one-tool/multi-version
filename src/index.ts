import { Command, Option } from 'commander';
import { exit } from 'node:process';
import { Versioner } from './commands/versioner.js';
import { Config, LogLevel, LogStatus, Options } from './types.js';
import type { MultiVersionError } from './utils/errors.js';
import * as Logger from './utils/logger.js';

declare global {
	let LOG_LEVEL: LogLevel;
}

const program = new Command();

program.name('Multi-Version').description('The simple and powerful tool to handle versioning inside your multi-packages monorepo');

program
	.addOption(new Option('-q, --quiet', 'Disable all logs').default(false).implies({ debug: false, verbose: false }))
	.addOption(new Option('-d, --debug', 'Log debug level logs').default(false).implies({ quiet: false, verbose: false }))
	.addOption(new Option('-v, --verbose', 'Log verbose level (all) logs').default(false).implies({ quiet: false, debug: false }))
	.addOption(new Option('-b, --base-branch <baseBranch>', 'Base branch to compare with').default('main'))
	.addOption(new Option('-s, --sync-mode', 'Enable synced mode versioning of the packages in the monorepo').default(false));

program
	.command('bump')
	.description('Bump updated packages, and generate CHANGELOGs')
	.action(async (options: Options) => {
		// @ts-expect-error - Assign value to global variable LOG_LEVEL
		globalThis.LOG_LEVEL = Logger.getLogLevel(options);

		const config: Config = {
			baseBranch: options.baseBranch,
			syncedMode: options.syncedMode,
		};

		try {
			const versioner = new Versioner(config);
			await versioner.bumpVersions();
			Logger.info(LogStatus.Ready, "All packages' version have been bumped!", 'Result');
		} catch (error) {
			Logger.error(LogStatus.Stop, `ERROR: ${(error as MultiVersionError).message}`, 'Result');
			exit(1);
		}
	});

program
	.command('validate')
	.description('Validate that updated packages have their version bumped according to the commit message')
	.action(async (options: Options) => {
		// @ts-expect-error - Assign value to global variable LOG_LEVEL
		globalThis.LOG_LEVEL = Logger.getLogLevel(options);

		const config: Config = {
			baseBranch: options.baseBranch,
			syncedMode: options.syncedMode,
		};

		try {
			const versioner = new Versioner(config);
			await versioner.validateVersions();
			Logger.info(LogStatus.Ready, "All packages' version are correctly bumped!", 'Result');
		} catch (error) {
			Logger.error(LogStatus.Stop, `ERROR: ${(error as MultiVersionError).message}`, 'Result');
			exit(1);
		}
	});

program.parse();
