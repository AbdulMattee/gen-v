import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { DEFAULT_EXCLUDE_FOLDERS, DEFAULT_VAR_PREFIXES, DEFAULT_OVERWRITE_PREV_ENV, DEFAULT_FILE_NAME } from './constant.js';
const __dirname = process.cwd();

export const args = yargs(hideBin(process.argv))
  .option('directory', {
    alias: 'd',
    description: 'The directory to scan for .env variables',
    type: 'string',
    demandOption: true,
    default: __dirname,
  })
  .option('exclude', {
    alias: 'e',
    description: 'Folders to exclude from the scan',
    type: 'array',
    demandOption: true,
    default: DEFAULT_EXCLUDE_FOLDERS,
  })
  .option('prefixes', {
    alias: 'p',
    description: 'Prefixes used with env variables',
    type: 'array',
    demandOption: true,
    default: DEFAULT_VAR_PREFIXES,
  })
  .option('name', {
    alias: 'n',
    description: 'Name of the output .env file',
    type: 'string',
    default: DEFAULT_FILE_NAME,
  })
  .option('output', {
    alias: 'o',
    description: 'Directory to place the generated .env file',
    type: 'string',
    demandOption: true,
    default: __dirname,
  })
  .option('overwrite', {
    alias: 'w',
    description: 'Flag to overwrite the previous .env file',
    type: 'boolean',
    demandOption: true,
    default: DEFAULT_OVERWRITE_PREV_ENV,
  })
  .option('print', {
    description: 'Prints all of the environment variables found in the directory',
    type: 'boolean',
    default: false,
  })
  .option('compare', {
    alias: 'c',
    description: 'Print a table of the added and removed environment variables',
    type: 'boolean',
    default: false,
  })
  .option('update', {
    alias: 'u',
    description: 'Update the existing .env file with the new environment variables',
    type: 'boolean',
    default: false,
  })
  .option('help', {
    alias: 'h',
    description: 'Show help',
    type: 'boolean',
    default: false,
  }).argv;
