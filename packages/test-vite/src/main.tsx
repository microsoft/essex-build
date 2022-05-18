/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable-next-line esm/extensions */
import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './App.js'

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root'),
)
