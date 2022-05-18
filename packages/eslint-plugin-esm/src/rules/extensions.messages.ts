/**
 * Error messages to report when linting fails the extensions rule
 *
 * Expected - message when linting fails due to a missing
 * file extension in relative import/export
 * Disalled - message when linting fails due to the presence
 * of an unexpected file extension in relative import/export
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
