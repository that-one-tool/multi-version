import { Package } from '@manypkg/get-packages';

export interface Config {
	baseBranch: string;
	syncedMode: boolean;
}

export interface Options {
	verbose: boolean;
	debug: boolean;
	quiet: boolean;
	baseBranch: string;
	syncedMode: boolean;
}

export type Json = string | number | boolean | null | { [property: string]: Json } | Json[];

export interface MinimalPackageJSON {
	name: string;
	version: string;
}

export interface PackageJSON extends MinimalPackageJSON {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
}

export interface MarkedPackage {
	version: string;
	path: string;
	pkg: Package;
	shouldBeUpdated: boolean;
}

export enum LogLevel {
	Quiet,
	Crit,
	Error,
	Warn,
	Info,
	Debug,
	Verbose,
}

export enum LogStatus {
	Error = 'error',
	Important = 'important',
	Invalid = 'invalid',
	None = 'none',
	Question = 'question',
	Ready = 'ready',
	Skip = 'skip',
	Stop = 'stop',
	Success = 'success',
	Valid = 'valid',
	Warning = 'warning',
}
