import chalk from 'chalk';
import { appendFileSync } from 'fs';
import { join } from 'path';
import { DEFAULT_FILE_NAME } from './constant.js';
import { findDifference, formatBlame, readExistingEnvFile } from './utils.js';

const { green, red, bgGray } = chalk;

export function updateOrCompareEnv(envDirectory: string, fileName: string, allEnvs: Set<string>, compare: boolean, update: boolean): void {
  try {
    const envFilePath = join(envDirectory, fileName || DEFAULT_FILE_NAME);
    const currentEnvs = readExistingEnvFile(envFilePath);
    const difference = findDifference(currentEnvs, allEnvs);

    if (!difference?.added?.length && !difference?.removed?.length) {
      console.log(green('The current .env file is up to date!'));
      return;
    }

    if (compare) {
      console.log(bgGray('The current .env file is out of date!'));
      console.log(green(`New variables: ${difference?.added?.length}`));
      console.log(red(`Removed variables: ${difference?.removed?.length}`));

      console.log(formatBlame(difference));
    } else if (update && difference?.added?.length) {
      const newVariables = `\n# Newly added env variables (${new Date()}) \n${difference.added
        .map((varName: string) => `${varName}=`)
        .join('\n')}\n`;

      appendFileSync(envFilePath, newVariables);

      console.log(green('The .env file has been updated!'));
    } else {
      console.log(red('No changes were made to the .env'));
    }
  } catch (err) {
    throw new Error(err as any);
  }
}
