export function difference<T>(main: Set<T>, remove: Set<T>): Set<T> {
	const result = new Set<T>()
	for (let v of main.values()) {
		if (!remove.has(v)) {
			result.add(v)
		}
	}
	return result
}
