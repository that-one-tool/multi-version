import { Json } from '../types.js';

function ensureError(value: unknown): Error {
	if (value instanceof Error) return value;

	let stringified;

	try {
		stringified = JSON.stringify(value);
	} catch {
		stringified = '[Unable to stringify the thrown value]';
	}

	return new Error(`Threw: ${stringified}`);
}

export class MultiVersionError extends Error {
	public readonly cause?: Error;
	public readonly context?: Json;

	constructor(message: string, options?: { cause?: unknown; context?: Json }) {
		super(message);

		this.cause = ensureError(options?.cause);
		this.context = options?.context;
		this.name = this.constructor.name;
	}
}

export class InvalidCommitError extends MultiVersionError {}
export class InvalidConfigError extends MultiVersionError {}
export class InvalidVersionError extends MultiVersionError {}
export class InvalidVersionBumpError extends MultiVersionError {}
export class ReadFileError extends MultiVersionError {}
export class WriteFileError extends MultiVersionError {}
