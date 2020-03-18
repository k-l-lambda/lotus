// https://eslint.org/docs/user-guide/configuring

module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
	},
	extends: [
		"@vue/typescript",
		"plugin:vue/base",
	],
	parserOptions: {
		parser: "babel-eslint",
		ecmaVersion: 2017,
	},
	rules: {
		"no-multiple-empty-lines": "off",
		"no-return-assign": "off",
		"no-sequences": "off",
		"no-extend-native": "off",
		quotes: [
			"warn",
			"double",
		],
		indent: [
			"warn",
			"tab",
		],
		"vue/html-indent": [
			"warn",
			"tab",
			{baseIndent: 1},
		],
		"vue/script-indent": [
			"warn", "tab", {baseIndent: 1},
		],
		"no-tabs": "off",
		"comma-dangle": ["warn", "always-multiline"],
		semi: ["error", "always"],
		curly: ["warn", "multi-or-nest"],
		eqeqeq: "warn",
		"spaced-comment": "off",
		"object-curly-spacing": "warn",
		"brace-style": ["error", "stroustrup"],
		camelcase: "off",
		"no-useless-escape": "warn",
		"no-unused-vars": ["warn", {varsIgnorePattern: "_"}],
		"quote-props": ["warn", "as-needed"],
		"prefer-const": "warn",
		"no-fallthrough": [
			"error",
			{
				commentPattern: "break[\\s\\w]*omitted",
			},
		],
		"new-cap": "off",
		"no-proto": "off",
		"space-before-function-paren": ["warn", "always"],
		"object-property-newline": "off",
		"standard/no-callback-literal": "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
	},
	overrides: [
		{
			files: ["*.vue"],
			rules: {
				indent: "off",
			},
		},
	],
	parserOptions: {
		parser: "@typescript-eslint/parser",
	},
};
