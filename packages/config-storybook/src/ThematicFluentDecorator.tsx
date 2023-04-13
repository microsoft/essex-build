/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Toggle, initializeIcons } from '@fluentui/react'
import {
	FluentProvider as Fluent9Provider,
	teamsDarkTheme,
	teamsLightTheme,
} from '@fluentui/react-components'
import { loadById } from '@thematic/core'
import { ThematicFluentProvider as ThematicFluent8Provider, loadFluentTheme } from '@thematic/fluent'
import { ApplicationStyles } from '@thematic/react'
import { useCallback, useMemo, useState } from 'react'
import styled, { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'

initializeIcons()
/**
 * ThematicFluentDecorator configures both Thematic and the Fluent wrapper
 * @param storyFn
 */
export const ThematicFluentDecorator = (storyFn: any) => {
	const [dark, handleDarkChange] = useDarkModeToggle()
	// load a non-standard theme, so it is obvious that it isn't the default
	// this helps identify problems with theme application in Fluent, which looks a lot like our default essex theme
	const thematicTheme = useMemo(() => loadById('autumn', { dark }), [dark])
	const fluent8Theme = useMemo(
		() => loadFluentTheme(thematicTheme),
		[thematicTheme],
	)
	const fluent9Theme = useMemo(
		() => (dark ? teamsDarkTheme : teamsLightTheme),
		[dark],
	)

	return (
		<ThematicFluent8Provider theme={thematicTheme}>
			<style>
				{`* {
						box-sizing: border-box;
					}`}
			</style>
			<ApplicationStyles />
			<Toggle label="Dark mode" checked={dark} onChange={handleDarkChange} />
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

const Container = styled.div`
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.application().faint().hex()};
`
