export interface BuildCommandOptions {
	verbose?: boolean
	docs?: boolean
	env?: string
	mode?: BundleMode
}

export enum BundleMode {
	production = 'production',
	development = 'development',
	none = 'none',
}
