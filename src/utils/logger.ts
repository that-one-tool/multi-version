import chalk from 'chalk';
import { LogLevel, LogStatus, Options } from '../types.js';

const colors: Record<string, string> = {
	verbose: '#7E8080',
	debug: '#4090C6',
	info: '#27AE60',
	warn: '#F39C12',
	error: '#C0392B',
	crit: '#7B241C',
};

const icons: Record<LogStatus, string> = {
	[LogStatus.Error]: '❌',
	[LogStatus.Important]: '❗',
	[LogStatus.Invalid]: '🔴',
	[LogStatus.None]: '➡',
	[LogStatus.Question]: '❓',
	[LogStatus.Ready]: '🚀',
	[LogStatus.Skip]: '⏩',
	[LogStatus.Stop]: '🛑',
	[LogStatus.Success]: '✅',
	[LogStatus.Valid]: '🟢',
	[LogStatus.Warning]: '🟠',
};

function log(colorHex: string, status: LogStatus, message: string, category?: string) {
	const cat = category ? chalk.bold(`[${category}] `) : '';
	console.log(chalk.hex(colorHex)(`${icons[status].toString()} ${cat}${message}`));
}

function shouldLog(level: LogLevel): boolean {
	return !!LOG_LEVEL && LOG_LEVEL >= level;
}

export function verbose(status: LogStatus, message: string, category?: string) {
	if (!shouldLog(LogLevel.Verbose)) {
		return;
	}

	log(colors.verbose, status, message, category);
}

export function debug(status: LogStatus, message: string, category?: string) {
	if (!shouldLog(LogLevel.Debug)) {
		return;
	}

	log(colors.debug, status, message, category);
}

export function info(status: LogStatus, message: string, category?: string) {
	if (!shouldLog(LogLevel.Info)) {
		return;
	}

	log(colors.info, status, message, category);
}

export function warn(status: LogStatus, message: string, category?: string) {
	if (!shouldLog(LogLevel.Warn)) {
		return;
	}

	log(colors.warn, status, message, category);
}

export function error(status: LogStatus, message: string, category?: string) {
	if (!shouldLog(LogLevel.Error)) {
		return;
	}

	log(colors.error, status, message, category);
}

export function crit(status: LogStatus, message: string, category?: string) {
	if (!shouldLog(LogLevel.Crit)) {
		return;
	}

	log(colors.crit, status, message, category);
}

export function getLogLevel(options: Options): LogLevel {
	if (options.verbose) {
		return LogLevel.Verbose;
	}

	if (options.debug) {
		return LogLevel.Debug;
	}

	if (options.quiet) {
		return LogLevel.Quiet;
	}

	return LogLevel.Info;
}
