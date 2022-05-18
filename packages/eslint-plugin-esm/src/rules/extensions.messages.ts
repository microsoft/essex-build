/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export enum ExtensionMessageIds {
	Expected = 'esm/extensions/expected',
	Disallowed = 'esm/extensions/disallowed',
}

export const ExtensionMessages: Record<ExtensionMessageIds, string> = {
	[ExtensionMessageIds.Expected]:
		'Missing acceptable file extension: {{extensions}}.',
	[ExtensionMessageIds.Disallowed]: 'Unexpected file extension {{extension}}.',
}
