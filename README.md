piql-cli
=================

CLI for Precision Intent Query Language


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/piql-cli.svg)](https://npmjs.org/package/piql-cli)
[![Downloads/week](https://img.shields.io/npm/dw/piql-cli.svg)](https://npmjs.org/package/piql-cli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g tql-cli
$ tql COMMAND
running command...
$ tql (--version)
tql-cli/0.0.0 darwin-arm64 node-v20.10.0
$ tql --help [COMMAND]
USAGE
  $ tql COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`tql create`](#tql-create)
* [`tql hello PERSON`](#tql-hello-person)
* [`tql hello world`](#tql-hello-world)
* [`tql help [COMMAND]`](#tql-help-command)
* [`tql plugins`](#tql-plugins)
* [`tql plugins add PLUGIN`](#tql-plugins-add-plugin)
* [`tql plugins:inspect PLUGIN...`](#tql-pluginsinspect-plugin)
* [`tql plugins install PLUGIN`](#tql-plugins-install-plugin)
* [`tql plugins link PATH`](#tql-plugins-link-path)
* [`tql plugins remove [PLUGIN]`](#tql-plugins-remove-plugin)
* [`tql plugins reset`](#tql-plugins-reset)
* [`tql plugins uninstall [PLUGIN]`](#tql-plugins-uninstall-plugin)
* [`tql plugins unlink [PLUGIN]`](#tql-plugins-unlink-plugin)
* [`tql plugins update`](#tql-plugins-update)

## `tql create`

Create a TQL file from a data source

```
USAGE
  $ tql create --in <value> --source csv [--facets <value>] [--out <value>]

FLAGS
  --facets=<value>   Comma-separated list of facets to generate (data,meaning,structure,ambiguity,intent,context)
  --in=<value>       (required) Input file path
  --out=<value>      Output file path (defaults to input path with .tql extension)
  --source=<option>  (required) Source data format
                     <options: csv>

DESCRIPTION
  Create a TQL file from a data source

EXAMPLES
  $ tql create --source csv --in data.csv
  Creating TQL file from data.csv...
  ✓ Created data.tql with 6 facets (@data, @meaning, @structure, @ambiguity, @intent, @context)

  $ tql create --source csv --in data.csv --out custom.tql
  Creating TQL file from data.csv...
  ✓ Created custom.tql with 6 facets (@data, @meaning, @structure, @ambiguity, @intent, @context)
```

_See code: [src/commands/create.ts](https://github.com/RonItelman/tql-cli/blob/v0.0.0/src/commands/create.ts)_

## `tql hello PERSON`

Say hello

```
USAGE
  $ tql hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ tql hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/RonItelman/tql-cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `tql hello world`

Say hello world

```
USAGE
  $ tql hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ tql hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/RonItelman/tql-cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `tql help [COMMAND]`

Display help for tql.

```
USAGE
  $ tql help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for tql.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.35/src/commands/help.ts)_

## `tql plugins`

List installed plugins.

```
USAGE
  $ tql plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ tql plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.53/src/commands/plugins/index.ts)_

## `tql plugins add PLUGIN`

Installs a plugin into tql.

```
USAGE
  $ tql plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into tql.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the TQL_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the TQL_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ tql plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ tql plugins add myplugin

  Install a plugin from a github url.

    $ tql plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ tql plugins add someuser/someplugin
```

## `tql plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ tql plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ tql plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.53/src/commands/plugins/inspect.ts)_

## `tql plugins install PLUGIN`

Installs a plugin into tql.

```
USAGE
  $ tql plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into tql.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the TQL_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the TQL_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ tql plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ tql plugins install myplugin

  Install a plugin from a github url.

    $ tql plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ tql plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.53/src/commands/plugins/install.ts)_

## `tql plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ tql plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ tql plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.53/src/commands/plugins/link.ts)_

## `tql plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ tql plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ tql plugins unlink
  $ tql plugins remove

EXAMPLES
  $ tql plugins remove myplugin
```

## `tql plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ tql plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.53/src/commands/plugins/reset.ts)_

## `tql plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ tql plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ tql plugins unlink
  $ tql plugins remove

EXAMPLES
  $ tql plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.53/src/commands/plugins/uninstall.ts)_

## `tql plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ tql plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ tql plugins unlink
  $ tql plugins remove

EXAMPLES
  $ tql plugins unlink myplugin
```

## `tql plugins update`

Update installed plugins.

```
USAGE
  $ tql plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.53/src/commands/plugins/update.ts)_
<!-- commandsstop -->
