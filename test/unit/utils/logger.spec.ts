/* eslint-disable @typescript-eslint/dot-notation, @typescript-eslint/no-floating-promises */

import * as assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { LogLevel, LogStatus } from '../../../src/types';
import * as Logger from '../../../src/utils/logger.js';

describe('Logger', () => {
	it('log should log a message with a category', () => {
		globalThis.LOG_LEVEL = LogLevel.Verbose;
		const mockConsole = mock.method(console, 'log');

		Logger.info(LogStatus.None, 'Test message', 'CATEGORY');

		const call = mockConsole.mock.calls[0];
		const message = call.arguments[0] as string;
		assert.ok(message.includes('➡'));
		assert.ok(message.includes('Test message'));
		assert.ok(message.includes('[CATEGORY]'));
	});

	it('log should log a message without a category', () => {
		globalThis.LOG_LEVEL = LogLevel.Verbose;
		const mockConsole = mock.method(console, 'log');

		Logger.info(LogStatus.Success, 'Test message');

		const call = mockConsole.mock.calls[0];
		const message = call.arguments[0] as string;
		assert.ok(message.includes('✅'));
		assert.ok(message.includes('Test message'));
		assert.ok(!message.includes('[CATEGORY]'));
	});

	it('log should log a message without a category', () => {
		globalThis.LOG_LEVEL = LogLevel.Verbose;
		const mockConsole = mock.method(console, 'log');

		Logger.info(LogStatus.None, 'Test message');

		const call = mockConsole.mock.calls[0];
		const message = call.arguments[0] as string;
		assert.ok(message.includes('Test message'));
		assert.ok(!message.includes('[CATEGORY]'));
	});

	it('verbose should log a message when log level is >= Verbose', () => {
		globalThis.LOG_LEVEL = LogLevel.Verbose;
		const mockConsole = mock.method(console, 'log');

		Logger.verbose(LogStatus.None, 'Test message');

		const calls = mockConsole.mock.calls;
		assert.ok(calls.length === 1);
	});

	it('verbose should not log a message when log level is < Verbose', () => {
		globalThis.LOG_LEVEL = LogLevel.Info;
		const mockConsole = mock.method(console, 'log');

		Logger.verbose(LogStatus.None, 'Test message');

		const calls = mockConsole.mock.calls;
		assert.ok(calls.length === 0);
	});

	it('verbose should not log a message when log level is not defined', () => {
		const mockConsole = mock.method(console, 'log');

		Logger.verbose(LogStatus.None, 'Test message');

		const calls = mockConsole.mock.calls;
		assert.ok(calls.length === 0);
	});

	it('debug should log a message when log level is >= Debug', () => {
		globalThis.LOG_LEVEL = LogLevel.Debug;
		const mockConsole = mock.method(console, 'log');

		Logger.debug(LogStatus.None, 'Test message');

		const calls = mockConsole.mock.calls;
		assert.ok(calls.length === 1);
	});

	it('debug should not log a message when log level is < Debug', () => {
		globalThis.LOG_LEVEL = LogLevel.Info;
		const mockConsole = mock.method(console, 'log');

		Logger.debug(LogStatus.None, 'Test message');

		const calls = mockConsole.mock.calls;
		assert.ok(calls.length === 0);
	});

	it('info should log a message when log level is >= Info', () => {
		globalThis.LOG_LEVEL = LogLevel.Info;
		const mockConsole = mock.method(console, 'log');

		Logger.info(LogStatus.None, 'Test message');

		const calls = mockConsole.mock.calls;
		assert.ok(calls.length === 1);
	});

	it('info should not log a message when log level is < Info', () => {
		globalThis.LOG_LEVEL = LogLevel.Warn;
		const mockConsole = mock.method(console, 'log');

		Logger.info(LogStatus.None, 'Test message');

		const calls = mockConsole.mock.calls;
		assert.ok(calls.length === 0);
	});

	it('warn should log a message when log level is >= Warn', () => {
		globalThis.LOG_LEVEL = LogLevel.Warn;
		const mockConsole = mock.method(console, 'log');

		Logger.warn(LogStatus.None, 'Test message');

		const calls = mockConsole.mock.calls;
		assert.ok(calls.length === 1);
	});

	it('warn should not log a message when log level is < Warn', () => {
		globalThis.LOG_LEVEL = LogLevel.Error;
		const mockConsole = mock.method(console, 'log');

		Logger.warn(LogStatus.None, 'Test message');

		const calls = mockConsole.mock.calls;
		assert.ok(calls.length === 0);
	});

	it('error should log a message when log level is >= Error', () => {
		globalThis.LOG_LEVEL = LogLevel.Error;
		const mockConsole = mock.method(console, 'log');

		Logger.error(LogStatus.None, 'Test message');

		const calls = mockConsole.mock.calls;
		assert.ok(calls.length === 1);
	});

	it('error should not log a message when log level is < Error', () => {
		globalThis.LOG_LEVEL = LogLevel.Crit;
		const mockConsole = mock.method(console, 'log');

		Logger.error(LogStatus.None, 'Test message');

		const calls = mockConsole.mock.calls;
		assert.ok(calls.length === 0);
	});

	it('crit should log a message when log level is >= Crit', () => {
		globalThis.LOG_LEVEL = LogLevel.Crit;
		const mockConsole = mock.method(console, 'log');

		Logger.crit(LogStatus.None, 'Test message');

		const calls = mockConsole.mock.calls;
		assert.ok(calls.length === 1);
	});

	it('crit should not log a message when log level is < Crit', () => {
		globalThis.LOG_LEVEL = LogLevel.Quiet;
		const mockConsole = mock.method(console, 'log');

		Logger.crit(LogStatus.None, 'Test message');

		const calls = mockConsole.mock.calls;
		assert.ok(calls.length === 0);
	});

	it('getLogLevel should return the log level - verbose', () => {
		const options = { verbose: true, debug: false, quiet: false };

		const logLevel = Logger.getLogLevel(options);

		assert.strictEqual(logLevel, LogLevel.Verbose);
	});

	it('getLogLevel should return the log level - debug', () => {
		const options = { verbose: false, debug: true, quiet: false };

		const logLevel = Logger.getLogLevel(options);

		assert.strictEqual(logLevel, LogLevel.Debug);
	});

	it('getLogLevel should return the log level - quiet', () => {
		const options = { verbose: false, debug: false, quiet: true };

		const logLevel = Logger.getLogLevel(options);

		assert.strictEqual(logLevel, LogLevel.Quiet);
	});

	it('getLogLevel should return the log level - info', () => {
		const options = { verbose: false, debug: false, quiet: false };

		const logLevel = Logger.getLogLevel(options);

		assert.strictEqual(logLevel, LogLevel.Info);
	});
});
