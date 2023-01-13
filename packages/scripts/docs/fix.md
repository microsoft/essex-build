# > essex fix

Performs static checks over a project, possibly fixing any issues that can be automatically fixed. Run `essex fix --help` for all options.

# CLI Options

- `--strict`<br/> enable strict checks. Warnings will result in a non-zero exit code.
- `--formatter \[formatter\]`<br/> specify a formatter to use. Defaults to `prettier`. Possible values are `prettier`, `rome`, and `none`.


# Details & Customization

See [check](./check.md) for details on the checks performed by this command.