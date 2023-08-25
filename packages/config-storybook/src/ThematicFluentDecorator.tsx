/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Toggle, initializeIcons } from '@fluentui/react'
import {
	FluentProvider as Fluent9Provider,
	type Theme as Fluent9Theme,
	teamsDarkTheme as teamsDarkThemeF9,
	teamsLightTheme as teamsLightThemeF9,
} from '@fluentui/react-components'
import { type Theme as ThematicTheme, loadById } from '@thematic/core'
import type { FluentTheme as Fluent8Theme } from '@thematic/fluent'
import {
	ThematicFluentProvider as ThematicFluent8Provider,
	loadFluentTheme as loadFluent8Theme,
} from '@thematic/fluent'
import { ApplicationStyles } from '@thematic/react'
import { useCallback, useMemo, useState } from 'react'
import styled, {
	ThemeProvider as StyledComponentsThemeProvider,
} from 'styled-components'

initializeIcons()
/**
 * ThematicFluentDecorator configures both Thematic and the Fluent wrapper
 * @param storyFn
 */
export const ThematicFluentDecorator = (storyFn: any) => {
	const [dark, handleDarkChange] = useDarkModeToggle()
	const thematicTheme = useThematicTheme(dark)
	const fluent8Theme = useFluent8Theme(thematicTheme)
	const fluent9Theme = useFluent9Theme(dark)

	return (
		<ThematicFluent8Provider theme={thematicTheme}>
			<style>
				{`* {
						box-sizing: border-box;
					}`}
			</style>
			<ApplicationStyles />
			<Toggle label='Dark mode' checked={dark} onChange={handleDarkChange} />
			<Fluent9Provider theme={fluent9Theme}>
				<StyledComponentsThemeProvider theme={fluent8Theme}>
					<Container>{storyFn(undefined, undefined)}</Container>
				</StyledComponentsThemeProvider>
			</Fluent9Provider>
		</ThematicFluent8Provider>
	)
}

function useDarkModeToggle(): [
	boolean,
	(e: unknown, v: boolean | undefined) => void,
] {
	const [dark, setDark] = useState(false)
	const handleDarkChange = useCallback(
		(_e: unknown, v: boolean | undefined) => {
			setDark(v ?? false)
		},
		[],
	)
	return [dark, handleDarkChange]
}

/**
 * Load a non-standard theme, so it is obvious that it isn't the default.
 * This helps identify problems with theme application in Fluent, which looks a lot like our default essex theme
 */
function useThematicTheme(dark: boolean): ThematicTheme {
	return useMemo(() => loadById('autumn', { dark }), [dark])
}

function useFluent8Theme(theme: ThematicTheme): Fluent8Theme {
	return useMemo(() => loadFluent8Theme(theme), [theme])
}

function useFluent9Theme(dark: boolean): Fluent9Theme {
	return useMemo(() => (dark ? teamsDarkThemeF9 : teamsLightThemeF9), [dark])
}

const Container = styled.div`
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.application().faint().hex()};
`
