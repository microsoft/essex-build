import { extensionsRule } from './rules/extensions.js'

// Export for commonjs modules
export const rules = {
	extensions: extensionsRule,
}

// Export for esm modules
export default { rules }
