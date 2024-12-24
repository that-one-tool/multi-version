# Multi-Version

<div style="text-align: center; display: flex; justify-content: center;">

![](multi-version-logo.png 'multi-version logo')

</div>

<div style="text-align: center; display: flex-box; justify-content: center;">
	<div>
	<b>Handle versioning easily inside your multi-packages monorepo.</b>
	</div>
	<br/>
	<a href="https://github.com/that-one-tool/multi-version">
		<img src="https://img.shields.io/github/v/release/that-one-tool/multi-version" alt="Release" />
	</a>
	<a href="https://www.npmjs.com/multi-version">
    	<img src="https://img.shields.io/npm/v/multi-version.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen" alt="multi-version on npm" />
	</a>
	<span>
		<img src="https://img.shields.io/bundlephobia/min/multi-version" alt="Package size" />
	</span>
	<br/>
	<a href="https://github.com/that-one-tool/multi-version/blob/master/LICENSE">
		<img src="https://img.shields.io/github/license/that-one-tool/multi-version" alt="License" />
	</a>
	<a href="https://github.com/that-one-tool/multi-version/issues">
		<img src="https://img.shields.io/github/issues/that-one-tool/multi-version" alt="Issues" />
	</a>
	<span>
		<img src="https://github.com/that-one-tool/multi-version/actions/workflows/nodejs_ci_main.yml/badge.svg" alt="Node.js CI" />
	</span>
	<span>
		<img src="https://img.shields.io/badge/coverage-93%25-success" alt="Coverage" />
	</span>
</div>

## Usage

### 1. Versions validation

In terminal, run:

```sh
npx @that-one-tool/multi-version validate
```

It will go through all packages in the repo, will compare the versions in the current branch with the versions in the base branch specified in the config.

Here are the options you can pass when executing the command (all are optional):

```sh
-b, --base-branch <branch name> # The base branch to compare with (default: main)
-s, --sync-mode # Enable synced mode versioning of the packages in the monorepo (default: false)

-q, --quiet # Disable all logs (default: false)
-d, --debug # Log debug level logs (default: false)
-v, --verbose # Log verbose level (all) logs (default: false)
```

- If all versions are valid in regards to the release type from the conventional commit message, the program will exit successfully with code 0.
- If at least one version is not valid, the program will fail and exit with code 1.

## Contribute

Please feel free to suggest improvements, features or bug fix through Git issues. Pull Requests for that are also more than welcome.

## Keywords

`version` `monorepo` `multipackage` `package` `versioning` `validation` `bump` `ci` `cd` `automation`
