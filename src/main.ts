#!/usr/bin/env node

import chalk from 'chalk';
import { args } from './argv.js';
import { updateOrCompareEnv } from './compare-env.js';
import { findEnvVars } from './find-env.js';
import { convertPrefixesToRegExp, createEnvFile, getOutputFilePath, printTable } from './utils.js';

const { blue, green, redBright } = chalk;

(function main(): void {
  try {
    const { print, directory, exclude, name, output, overwrite, prefixes, compare, update } = args as Arguments;

    const prefixesRegExp: RegExp[] = convertPrefixesToRegExp(prefixes);
    const excludedDirectories: string[] = JSON.parse(exclude);
    const variablesFound: Set<string> = findEnvVars(directory, excludedDirectories, prefixesRegExp);
    const variablesList: string[] = Array.from(variablesFound).sort();

    console.log(blue('Scanned directory:'), green(directory));
    console.log(blue('Excluded folders:'), green(excludedDirectories.filter((folder) => folder !== directory)));

    if (variablesFound?.size > 0) {
      console.log(blue('Total environment variables found:'), green(variablesFound.size));
    }

    if (compare || update) {
      updateOrCompareEnv(directory, name, variablesFound, compare, update);
    } else {
      if (!variablesFound?.size) {
        console.log(redBright('No environment variables found in the directory.'));
        return;
      }

      if (print) {
        printTable(variablesList);
      } else {
        const outputFilePath = getOutputFilePath(output, name, overwrite);
        createEnvFile(variablesList, outputFilePath);
        console.log(blue('Output file:'), green(outputFilePath));
      }
    }
  } catch (err: any) {
    if (err.message.includes('Unexpected token')) {
      console.log('Invalid json array provided. Please provide a valid JSON array.');
    } else {
      console.error('Error generating your file:\n', err?.message);
    }
  }
})();
