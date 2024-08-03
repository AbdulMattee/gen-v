import chalk from 'chalk';
import Table from 'cli-table';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { DEFAULT_FILE_NAME } from './constant.js';

export function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\.').replace(/\"|\'/g, '');
}

export function createEnvPatterns(prefixes: string[]): RegExp[] {
  return prefixes.map((prefix) => new RegExp(`${escapeRegex(prefix)}\\.(\\w+)`, 'g'));
}

export function convertPrefixesToRegExp(prefixes: string): RegExp[] {
  const envPrefixes: string[] = JSON.parse(prefixes);
  const envPrefixesRegExps = createEnvPatterns(envPrefixes);

  return envPrefixesRegExps;
}

export function createEnvFile(envVars: string[], outputFile: string): void {
  const content = envVars.map((varName) => `${varName}=`).join('\n');
  writeFileSync(outputFile, content);
}

export function getOutputFilePath(outputDirectory: string, outputFileName: string, overWritePrevEnv: boolean): string {
  const timestamp = new Date().getTime();
  return join(outputDirectory, overWritePrevEnv || outputFileName ? outputFileName : `${DEFAULT_FILE_NAME}-${timestamp}`);
}

export function readExistingEnvFile(envFilePath: string): Set<string> {
  const envVars = new Set<string>();

  if (existsSync(envFilePath)) {
    const content = readFileSync(envFilePath, 'utf8');
    const lines = content.split('\n');

    for (const line of lines) {
      if (!line.startsWith('#')) {
        const [key] = line.split('=');
        if (key) {
          envVars.add(key.trim());
        }
      }
    }
  }

  return envVars;
}

export function findDifference(original: Set<string>, updated: Set<string>): Blame {
  const blame: Blame = { added: [], removed: [] };

  original.forEach((item) => {
    if (!updated.has(item)) {
      blame.removed.push(item);
    }
  });

  updated.forEach((item) => {
    if (!original.has(item)) {
      blame.added.push(item);
    }
  });

  return blame;
}

export function formatBlame(blame: Blame): string {
  const table = new Table({
    head: [chalk.white('Added Variables'), chalk.white('Removed Variable')],
  });

  const maxLength = Math.max(blame.added.length, blame.removed.length);

  for (let i = 0; i < maxLength; i++) {
    table.push([chalk.green(blame?.added?.[i] || ''), chalk.red(blame?.removed?.[i] || '')]);
  }

  return table.toString();
}

export function printTable(variables: string[]): void {
  const table = new Table({
    head: ['#', 'Environment Variables'],
    colAligns: ['middle'],
    chars: {
      top: '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      bottom: '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      left: '║',
      'left-mid': '╟',
      mid: '─',
      'mid-mid': '┼',
      right: '║',
      'right-mid': '╢',
      middle: '│',
    },
    rows: variables.map((variable, i) => [(i + 1).toString(), variable]),
  });
  console.log(table.toString());
}
