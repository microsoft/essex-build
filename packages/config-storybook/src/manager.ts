/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { addons } from '@storybook/addons'
import { create, type ThemeVars } from '@storybook/theming'
import { darken, lighten } from '@thematic/color'
import { defaultThemes, loadById, Theme } from '@thematic/core'

export interface ManagerConfiguration {
	themeVars?: Partial<ThemeVars>,
	thematicTheme?: Theme

	/**
	 * 
	 * @param input - The config sent to adddons.configure; e.g. ({theme})
	 * @returns The updated config
	 */
	addonConfigFinal?: (input: any) => any
}

const identity = <T>(x: T) => x

export function configureManager({
	themeVars: inputVars = {},
	addonConfigFinal = identity,
	thematicTheme: inTheme = loadById(defaultThemes[0]!.id)
}: ManagerConfiguration): void {
	const textColor = inTheme.text().fill().hex()
	const theme = create({
		base: 'light',
	
		// Typography
		fontBase: inTheme.text().fontFamily(),
		fontCode: 'monospace',
	
		// Text colors
		// Note: using recommended colors from Accessibility Insights to clear FastPass check
		barBg: darken(textColor, 5),
		inputBg: 'red',
		buttonBg: 'red',
		booleanBg: 'red',
		booleanSelectedBg: 'red',
		textColor,
		textMutedColor: lighten(textColor),
		barTextColor: darken(textColor, 5),
		textInverseColor: darken(textColor, 5),
		inputTextColor: darken(textColor),
	
		...inputVars,
	})

	addons.setConfig(addonConfigFinal({
		theme,
	}))
}

