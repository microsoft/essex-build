# > essex clean

# CLI Options

- `...paths`<br/> Optional clean paths

# Details & Customization

The clean command deletes directories containing build artifacts. If no directories are passed in, then it will delete `dist` and `lib` by default. It accepts a variadic list of paths.

```sh
> essex clean foo bar baz bing bang boom
```
