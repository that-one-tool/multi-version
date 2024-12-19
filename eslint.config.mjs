import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		files: ['src/**/*.{js,mjs,cjs,ts}', 'test/**/*.{js,mjs,cjs,ts}'],
	},
	eslint.configs.recommended,
	tseslint.configs.recommendedTypeChecked,
	tseslint.configs.stylisticTypeChecked,
	{
		files: ['**/*.ts'],
		languageOptions: {
			parserOptions: {
				project: './tsconfig.eslint.json',
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		ignores: ['dist/**/*', './node_modules/**/*', 'eslint.config.mjs'],
	},
	{
		overrides: [
			{
				files: ['test/**/*'],
				env: {
					jest: true,
				},
			},
		],
	},
);