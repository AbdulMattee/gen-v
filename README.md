# gen-v

`gen-v` is a command-line tool for generating and managing environment variables. It scans a directory for environment variables and creates a `.env` file based on the results. You can configure it to exclude certain folders, specify prefixes for environment variables, and control whether to overwrite existing `.env` files.

## Installation

To use `gen-v`, you need to have Node.js and npm installed. You can install the package globally using npm:

```bash
npm install -g gen-v
```

## Usage

You can run `gen-v` using the command line. Below are the available options:

### Command Line Options

| Option        | Alias | Description                                                   | Type      | Default Value                                                                           |
| ------------- | ----- | ------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------- |
| `--directory` | `-d`  | The directory to scan for `.env` variables                    | `string`  | Current working directory (`process.cwd()`)                                             |
| `--exclude`   | `-e`  | Folders to exclude from the scan                              | `array`   | `["node_modules", "dist", "build", "test", ".git", "coverage", "public", "out", "tmp"]` |
| `--prefixes`  | `-p`  | Prefixes used with env variables                              | `array`   | `["process.env"]`                                                                       |
| `--name`      | `-n`  | Name of the output `.env` file                                | `string`  | `.env`-`timestamp`                                                                      |
| `--output`    | `-o`  | Directory to place the generated `.env` file                  | `string`  | Current working directory (`process.cwd()`)                                             |
| `--overwrite` | `-w`  | Flag to overwrite the previous `.env` file                    | `boolean` | `false`                                                                                 |
| `--print`     |       | Print all of the environment variables found in the directory | `boolean` | `false`                                                                                 |
| `--version`   | `-v`  | Displays the current version                                  |           |                                                                                         |
| `--help`      | `-h`  | List all the commands                                         |           |                                                                                         |

## Example

1. It will generate an env in the root directory with name .env-timestamp

```bash
gen-v
```

2. Specify directory and exclude folders:

```bash
gen-v --directory ./src --exclude '["node_modules", "dist"]'
```

3. Specify prefixes and output directory:

```bash
gen-v --prefixes '["MY_APP"]' --output ./config
```

4. Print environment variables without creating a file:

```bash
gen-v --print
```

5. Overwrite existing .env file:

```bash
gen-v --overwrite
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
