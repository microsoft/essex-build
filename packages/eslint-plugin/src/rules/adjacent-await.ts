/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */
/* eslint-disable  @typescript-eslint/no-unsafe-argument */

function findAncestorParentedByType(node: any, type: string): any {
	let target = node

	while (target?.parent && target.parent.type !== type) {
		target = node.parent
	}
	if (target.parent && target.parent.type === type) {
		return target
	}
}

const noAdjacentAwait = {
	create(context: any): any {
		const awaitAncestors = new Map()
		const awaitExpressions = new Map()
		const referencedIdentifiers = new Map()
		const definedIdentifiers = new Map()

		function validate(asyncInfo: any, identifiersToIgnore: any[]): any {
			if (asyncInfo) {
				const { identifiers, statement } = asyncInfo
				const usedNames = new Set(identifiersToIgnore.map((n) => n.name))
				const usingIdentifiers = identifiers.some((m: any) =>
					usedNames.has(m.name),
				)
				if (!usingIdentifiers) {
					context.report({
						node: statement,
						message:
							'multiple await statements should be combined using Promise.all (performance)',
					})
					return false
				}
			}
		}

		function findAwaitInfo(statement: any): any {
			const expressions = awaitExpressions.get(statement) || []
			if (expressions) {
				const identifiers = referencedIdentifiers.get(statement) || []
				return {
					expressions,
					identifiers,
					statement,
				}
			}
		}
		const awaitExpressionStack: any[] = []
		const variableDeclarationStack: any[] = []
		const blockStack: any[] = []
		return {
			AwaitExpression(node: any): void {
				// TODO: Refacator this like a stack, so we don't need to "look" up the ancestor
				const ancestor = findAncestorParentedByType(node, 'BlockStatement')
				awaitExpressionStack.push({
					expression: node,
					ancestor,
				})
				awaitAncestors.set(node, ancestor)

				let expressions = awaitExpressions.get(ancestor) as any[]
				if (!expressions) {
					expressions = []
					awaitExpressions.set(ancestor, expressions)
				}
				expressions.push(node)
			},
			'AwaitExpression:exit'(): void {
				awaitExpressionStack.pop()
			},
			VariableDeclarator(node: any): void {
				variableDeclarationStack.push({
					declaration: node,
					identifiers: [],
				})
			},
			'VariableDeclarator:exit'(): void {
				variableDeclarationStack.pop()
			},
			Identifier(node: any): void {
				awaitExpressionStack.forEach((item) => {
					const { ancestor } = item
					let identifiers = referencedIdentifiers.get(ancestor) as any[]
					if (!identifiers) {
						identifiers = []
						referencedIdentifiers.set(ancestor, identifiers)
					}
					identifiers.push(node)
				})

				if (
					node.parent &&
					// rome-ignore lint/suspicious/noPrototypeBuiltins: Need for Linter Rule
					((node.parent.hasOwnProperty('shorthand') && node.parent.shorthand) ||
						node.parent.type === 'VariableDeclarator' ||
						node.parent.type === 'ArrayPattern')
				) {
					if (variableDeclarationStack.length > 0) {
						const { declaration, identifiers } =
							variableDeclarationStack[variableDeclarationStack.length - 1]
						identifiers.push(node)

						let list = definedIdentifiers.get(declaration) as any[]
						if (!list) {
							list = []
							definedIdentifiers.set(declaration, list)
						}
						list.push(node)
					}
				}
			},
			BlockStatement(node: any): void {
				blockStack.push({
					block: node,
				})
			},
			'BlockStatement:exit'(node: any): void {
				blockStack.pop()
				let prevAsyncInfo: any
				let identifiersToIgnore: any[] = []
				let hasAdjacentAsyncAwaits = false
				node.body.forEach((statement: any) => {
					if (statement.type === 'VariableDeclaration') {
						const declarations = statement.declarations ?? []
						declarations.forEach((declaration: any) => {
							identifiersToIgnore.push(
								...((definedIdentifiers.get(declaration) as any[]) || []),
							)
						})
					}

					const asyncInfo = findAwaitInfo(statement)
					if (asyncInfo && asyncInfo.expressions.length > 0) {
						if (prevAsyncInfo) {
							hasAdjacentAsyncAwaits = true
						}
						prevAsyncInfo = asyncInfo
					}

					if (hasAdjacentAsyncAwaits) {
						validate(prevAsyncInfo, identifiersToIgnore.slice(0))
						hasAdjacentAsyncAwaits = false
						prevAsyncInfo = asyncInfo
					}

					// This resets everything when there is no longer an adjacent await
					if (!asyncInfo || asyncInfo.expressions.length === 0) {
						hasAdjacentAsyncAwaits = false
						prevAsyncInfo = undefined
						identifiersToIgnore = []
					}
				})

				if (hasAdjacentAsyncAwaits) {
					validate(prevAsyncInfo, identifiersToIgnore.slice(0))
				}
			},
		}
	},
}
export default noAdjacentAwait
