# env-toolkit

`env-toolkit` is a command-line tool for generating and managing environment variables. It scans a directory for environment variables and creates a `.env` file based on the results. You can configure it to exclude certain folders, specify prefixes for environment variables, and control whether to overwrite existing `.env` files.

## Generating Files

By default, `env-toolkit` scans the current working directory for environment variables and generates a `.env` file with the format `env-timestamp`, you can pass a name of the output file or also overwrite the previous env file as well.

```
Scanned directory: my-fancy-project
Excluded folders: node_modules,dist,build,test,.git,build,coverage,public,out,tmp
Total environment variables found: 72
Output file: /my-fancy-project/.env-1722716928992
```

## Printing Variables

You can pass the `--print` option to print a table of all the variables found in the current directory. The variables are alphabetically ordered.

```
Scanned directory: my-fancy-project
Excluded folders: node_modules,dist,build,test,.git,build,coverage,public,out,tmp
Total environment variables found: 3
╔════╤════════════════════════════════════════╗
║ #  │ Environment Variables                  ║
╟────┼────────────────────────────────────────╢
║ 1  │ VARIABLE_1                             ║
╟────┼────────────────────────────────────────╢
║ 2  │ VARIABLE_2                             ║
╟────┼────────────────────────────────────────╢
║ 3  │ VARIABLE_3                             ║
╚════╧════════════════════════════════════════╝
```

## Comparing Variables

You can pass the `--compare` or `-c` option to compare your current env file (default: `.env`) and see what are the new variables that have been added or which of the variables have been removed. This can help you identify the changes in your `.env` rather than just creating or print all the variables.

```
The current .env file is out of date!
New variables: 3
Removed variables: 1
┌─────────────────┬──────────────────┐
│ Added Variables │ Removed Variable │
├─────────────────┼──────────────────┤
│ VARIABLE_1      │ VARIABLE_4       │
├─────────────────┼──────────────────┤
│ VARIABLE_2      │                  │
├─────────────────┼──────────────────┤
│ VARIABLE_3      │                  │
└─────────────────┴──────────────────┘
```

## Updating Variables

You may not want to create a whole new `.env` file but just want the newly added variables, you can use the `--update` or `-u` option to update your existing `.env`. This will add all the new variables at the end of your `.env` file with the time

```
# Newly added env variables (time)

VAR1 =
VAR2 =
```

## Installation

To use `env-toolkit`, you need to have Node.js and npm installed. You can install the package globally using npm:

```bash
npm install -g env-toolkit
```

## Usage

You can run `env-toolkit` using the command line. Below are the available options:

### Command Line Options

| Option      | Alias | Description                                                           | Type      | Default Value                                                                           |
| ----------- | ----- | --------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------- |
| `directory` | `-d`  | The directory to scan for `.env` variables                            | `string`  | Current working directory                                                               |
| `exclude`   | `-e`  | Folders to exclude from the scan                                      | `array`   | `["node_modules", "dist", "build", "test", ".git", "coverage", "public", "out", "tmp"]` |
| `prefixes`  | `-p`  | Prefixes used with env variables                                      | `array`   | `["process.env"]`                                                                       |
| `name`      | `-n`  | Name of the output `.env` file                                        | `string`  | `.env`-`timestamp`                                                                      |
| `output`    | `-o`  | Directory to place the generated `.env` file                          | `string`  | Current working directory                                                               |
| `overwrite` | `-w`  | Flag to overwrite the previous `.env` file                            | `boolean` | `false`                                                                                 |
| `print`     | none  | Print all of the environment variables found in the directory         | `boolean` | `false`                                                                                 |
| `compare`   | `-c`  | Checks the current `.env` file and prints the new o removed variables |           |                                                                                         |
| `update`    | `-u`  | Updates the previous `.env` file                                      |           |                                                                                         |
| `version`   | none  | Displays the current version                                          |           |                                                                                         |
| `help`      | `-h`  | List all the commands                                                 |           |                                                                                         |

## Example

1. It will generate an env in the root directory with name .env-timestamp

```bash
env-toolkit
```

2. Specify directory and exclude folders:

```bash
env-toolkit --directory ./src --exclude '["node_modules", "dist"]'
```

3. Specify prefixes and output directory:

```bash
env-toolkit --prefixes '["MY_APP"]' --output ./config
```

4. Print environment variables without creating a file:

```bash
env-toolkit --print
```

5. Overwrite existing .env file:

```bash
env-toolkit --overwrite
```

## Contributing

Contributions are welcome! Please open an issue or a pull request if you have any improvements or bug fixes.

## License

This project is licensed under the ISC License. See the LICENSE file for details.

## Author

<div>
	<a href="mailto:abdulmattee123@gmail.com" target="_blank">
	  <img src="https://img.shields.io/badge/Gmail-%230077B5.svg?style=flat-square&logoColor=white&logo=Gmail&color=red" />
	</a>
	<a href="https://www.linkedin.com/in/abdul-mattee/" target="_blank">
	  <img src="https://img.shields.io/badge/Linkedin-%230077B5.svg?style=flat-square&logo=linkedin" />
	</a>
	<a href="https://stackoverflow.com/users/15460455/abdul-mattee" target="_blank">
	  <img src="https://img.shields.io/badge/Stackoverflow-%230077B5.svg?style=flat-square&logo=stackoverflow&logoColor=white&color=F48024" />
	</a>
  <a href="https://github.com/AbdulMattee" target="_blank" >
    <img src="https://img.shields.io/badge/GitHub-black?logo=github&style=flat-square&label=" />
  </a>
</div>
