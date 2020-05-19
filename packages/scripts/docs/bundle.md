# > essex bundle

# CLI Options

- `--verbose`<br/> enables verbose mode
- `--env <env>`<br/> webpack env
- `--mode <env>`<br/> webpack mode

# Details & Customization

- **TypeScript & Babel**<br/> Refer to the [build](./build.md) documentation for information on how to customize TypeScript and Babel.

- `webpack.config.js`<br/> By default, a prescribed webpack configuration will be used. This configuration is the same one used in the `serve` command to serve TypeScript web-applications. This can be overridden entirely by defining a `webpack.config.js` file in your package.

- `webpack.override.js`<br/> By defining webpack.override.js, you can opt into function-based customization of the prescribed webpack configuration. The following extension hooks may be defined:

  - `extendAliases(env, mode)`<br/> Returns an object that is splatted into `resolve.alias` configuration section.
  - `extendDevServer(env, mode)`<br/> Returns an object that is splatted into the `devServer` configuration section.
  - `extendEnvironment(env, mode)`<br/>Returns an object that is splatted into the `ProvidePlugin` to define a runtime `process.env`.
  - `extendResolveModules(env, mode)`<br/>Returns a list of strings that are prepended onto the default resolve paths.
  - `extendResolveLoaderModules(env, mode)`<br/>Returns a list of strings that are prepended onto the default resolve paths for loaders.
  - `htmlWebpackPlugin(env, mode)`<br/> Returns a configuration object used to extend the HTMLWebpackPlugin.
  - `extendConfiguration(config, env, mode)`<br/>The final webpack configuration is passed into this function for a final chance for client-side mutation. The resultant configuration object should be returned.
