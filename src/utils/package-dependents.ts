import { LogStatus, MarkedPackage } from '../types.js';
import * as Logger from '../utils/logger.js';

/**
 * Get the flatten dependent table of packages
 *
 * @param {Record<string, Package>} packageMap The dictionary of the packages in the repo
 * @returns {Record<string, string[]>} The flatten dependent table
 */
export function getFlattenDependentTable(packageMap: Record<string, MarkedPackage>): Record<string, string[]> {
	Logger.verbose(LogStatus.None, 'Getting flatten dependent table...');
	const packageDependentsMap: Record<string, string[]> = {};

	if (!Object.keys(packageMap).length) {
		return {};
	}

	// First level dependents
	for (const [packageName, markedPackage] of Object.entries(packageMap)) {
		Logger.verbose(LogStatus.None, `Getting dependents of package ${packageName}...`);

		const deps = [
			...Object.keys(markedPackage.pkg.packageJson.dependencies ?? {}),
			...Object.keys(markedPackage.pkg.packageJson.devDependencies ?? {}),
		].filter((depName) => Object.keys(packageMap).includes(depName));
		Logger.verbose(LogStatus.None, `First level dependencies of package ${packageName}: ${deps.join(', ') ?? 'none'}`);

		for (const dep of deps) {
			if (!packageDependentsMap[dep]) {
				packageDependentsMap[dep] = [];
			}

			packageDependentsMap[dep].push(packageName);

			Logger.verbose(LogStatus.None, `First level dependents of package ${dep}: ${packageDependentsMap[dep].join(', ') ?? 'none'}`);
		}
	}

	// Deep level dependents
	for (const pkg of Object.keys(packageMap)) {
		const firstLevelDeps = packageDependentsMap[pkg] ?? [];
		const flattenDependents = [...firstLevelDeps];

		flattenDependents.push(...getDependentsDeep(packageDependentsMap, firstLevelDeps));
		packageDependentsMap[pkg] = Array.from(new Set(flattenDependents)).filter((dep) => dep !== pkg);

		Logger.verbose(LogStatus.None, `Deep level dependents of package ${pkg}: ${packageDependentsMap[pkg].join(', ')}`);
	}

	Logger.verbose(LogStatus.None, 'Flatten dependent table prepared');
	Logger.verbose(LogStatus.None, `Flatten dependent table: ${JSON.stringify(packageDependentsMap)}`);

	return packageDependentsMap;
}

function getDependentsDeep(packageDependentsMap: Record<string, string[]>, deps: string[]): string[] {
	const flattenDependents = [];

	for (const dep of deps) {
		const deepDependents = packageDependentsMap[dep] ?? [];
		flattenDependents.push(...deepDependents);
		flattenDependents.push(...getDependentsDeep(packageDependentsMap, deepDependents));
		Logger.verbose(LogStatus.None, `Deep level dependents of package ${dep}: ${flattenDependents.join(', ')}`);
	}

	return flattenDependents;
}
