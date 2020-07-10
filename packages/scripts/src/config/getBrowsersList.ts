export function getBrowsersList(
	env: string,
	setting: undefined | string[] | Record<string, string[]>,
): string[] {
	if (setting == null) {
		return ['> 0.25%, not dead']
	} else if (Array.isArray(setting)) {
		return setting
	} else {
		return setting[env]
	}
}
