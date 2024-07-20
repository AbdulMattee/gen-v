#!/usr/bin/env node
import { statSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { sync as globSync } from "glob";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { fileURLToPath } from "url";
import {
  DEFAULT_OVERWRITE_PREV_ENV,
  DEFAULT_FILE_NAME,
  DEFAULT_EXCLUDE_FOLDERS,
  DEFAULT_VAR_PREFIXES,
  BLUE_COLOR,
  GREEN_BG_COLOR,
  GREEN_COLOR,
} from "./constant.js";

const __dirname = process.cwd();

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\.").replace(/\"|\'/g, "");
}

function createEnvPatterns(prefixes: string[]): RegExp[] {
  return prefixes.map(
    (prefix) => new RegExp(`${escapeRegex(prefix)}\\.(\\w+)`, "g")
  );
}

function convertPrefixesToRegExp(prefixes: string): RegExp[] {
  const envPrefixes: string[] = JSON.parse(prefixes);
  const envPrefixesRegExps = createEnvPatterns(envPrefixes);

  return envPrefixesRegExps;
}

async function findEnvVars(
  directory: string,
  excludeFolders: string[],
  envPatterns: RegExp[]
): Promise<Set<string>> {
  const envVars = new Set<string>();
  const excludedFolders = excludeFolders.map(
    (folder) => `${directory}/${folder}/**`
  );
  const filesToSearch = `${directory}/**/*.{js,ts}`;

  const foundFiles = globSync(filesToSearch, { ignore: excludedFolders });

  for (const file of foundFiles) {
    const stats = statSync(file);

    if (stats.isFile()) {
      const content = readFileSync(file, "utf8");

      for (const pattern of envPatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          envVars.add(match[1]);
        }
      }
    }
  }

  return envVars;
}

function createEnvFile(envVars: string[], outputFile: string): void {
  const content = envVars.map((varName) => `${varName}=`).join("\n");
  writeFileSync(outputFile, content);
}

function getOutputFilePath(
  outputDirectory: string,
  outputFileName: string,
  overWritePrevEnv: boolean
): string {
  const timestamp = new Date().getTime();
  return join(
    outputDirectory,
    overWritePrevEnv || outputFileName
      ? outputFileName
      : `${DEFAULT_FILE_NAME}-${timestamp}`
  );
}

async function main(): Promise<void> {
  const argv = yargs(hideBin(process.argv))
    .option("directory", {
      alias: "d",
      description: "The directory to scan for .env variables",
      type: "string",
      demandOption: true,
      default: __dirname,
    })
    .option("exclude", {
      alias: "e",
      description: "Folders to exclude from the scan",
      type: "array",
      demandOption: true,
      default: DEFAULT_EXCLUDE_FOLDERS,
    })
    .option("prefixes", {
      alias: "p",
      description: "Prefixes used with env variables",
      type: "array",
      demandOption: true,
      default: DEFAULT_VAR_PREFIXES,
    })
    .option("name", {
      alias: "n",
      description: "Name of the output .env file",
      type: "string",
    })
    .option("output", {
      alias: "o",
      description: "Directory to place the generated .env file",
      type: "string",
      demandOption: true,
      default: __dirname,
    })
    .option("overwrite", {
      alias: "w",
      description: "Flag to overwrite the previous .env file",
      type: "boolean",
      demandOption: true,
      default: DEFAULT_OVERWRITE_PREV_ENV,
    })
    .option("print", {
      description:
        "Prints all of the environment variables found in the directory",
      type: "boolean",
      default: false,
    })
    .version("v", "1.0.2")
    .help("h", "List all the commands").argv;

  try {
    const { print, directory, exclude, name, output, overwrite, prefixes } =
      argv;

    const outputFilePath = getOutputFilePath(output, name, overwrite);
    const excludedDirectories = JSON.parse(exclude);
    const prefixesRegExp = convertPrefixesToRegExp(prefixes);
    const envVars = await findEnvVars(
      directory,
      excludedDirectories,
      prefixesRegExp
    );
    const sortedVars = Array.from(envVars).sort();

    if (envVars.size > 0) {
      console.log(
        BLUE_COLOR,
        "Total environment variables found:",
        GREEN_COLOR,
        envVars.size
      );
    }

    console.log(BLUE_COLOR, "Scanning directory:", GREEN_COLOR, directory);
    console.log(
      BLUE_COLOR,
      "Excluded folders:",
      GREEN_COLOR,
      JSON.stringify(
        excludedDirectories.filter((folder: string) => folder !== directory)
      )
    );

    if (envVars.size === 0) {
      console.log(GREEN_BG_COLOR, "No environment variables found");
    } else if (print) {
      console.table(sortedVars);
    } else {
      createEnvFile(sortedVars, outputFilePath);
      console.log(BLUE_COLOR, "Output file:", GREEN_COLOR, outputFilePath);
    }
  } catch (err: any) {
    if (err.message.includes("Unexpected token")) {
      console.log(
        "Invalid json array provided. Please provide a valid JSON array."
      );
    } else {
      console.error("Error generating your file:\n", err?.message);
    }
  }
}

main();
