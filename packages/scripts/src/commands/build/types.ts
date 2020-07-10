export interface BuildCommandOptions {
	verbose?: boolean
	docs?: boolean
	env?: string
	mode?: BundleMode
	storybook?: boolean
}

export enum BundleMode {
	production = 'production',
	development = 'development',
	none = 'none',
}
