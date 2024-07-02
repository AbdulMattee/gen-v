const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const yargs = require('yargs');

const DEFAULT_EXCLUDE_FOLDERS = ['node_modules', 'dist', 'build', 'test', '.git'];
const DEFAULT_VAR_PREFIXES = ['process.env'];
const DEFAULT_OUTPUT_FILE_NAME = '.env';
const DEFAULT_OVERWRITE_PREV_ENV = false;

const envPatterns = [/process\.env\.(\w+)/g];

async function findEnvVars(directory, excludeFolders) {
  const envVars = new Set();
  const excludedFolders = excludeFolders.map((folder) => `${directory}/${folder}/**`);
  const filesToSearch = `${directory}/**/*.{js,ts}`;

  const foundFiles = new glob.sync(filesToSearch, { ignore: excludedFolders });
  console.log({ envPatterns });

  for (const file of foundFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const pattern of envPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        envVars.add(match[1]);
      }
    }
  }

  return envVars;
}

function createEnvFile(envVars, outputFile) {
  const sortedEnvVars = Array.from(envVars).sort();
  const content = sortedEnvVars.map((varName) => `${varName}=`).join('\n');
  fs.writeFileSync(outputFile, content);
}

function getOutputFilePath(outputDirectory, outputFileName, overWritePrevEnv) {
  const timestamp = new Date().getTime();
  return path.join(
    outputDirectory,
    overWritePrevEnv || outputFileName !== DEFAULT_OUTPUT_FILE_NAME ? outputFileName : `${outputFileName}-${timestamp}`,
  );
}

async function main() {
  const argv = yargs
    .option('directory', {
      alias: 'd',
      description: 'The directory to scan for .env variables',
      type: 'string',
      demandOption: true,
      default: path.resolve(__dirname),
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
    .option('outputName', {
      alias: 'n',
      description: 'Name of the output .env file',
      type: 'string',
      demandOption: true,
      default: DEFAULT_OUTPUT_FILE_NAME,
    })
    .option('outputDirectory', {
      alias: 'o',
      description: 'Directory to place the generated .env file',
      type: 'string',
      demandOption: true,
      default: path.resolve(__dirname),
    })
    .option('overwritePrevEnv', {
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
    .version('v', 'Displays the current version')
    .help('h', 'List all the commands').argv;

  const { print, directory, exclude, outputName, outputDirectory, overwritePrevEnv, prefixes } = argv;
  envPatterns.push(new RegExp(`${prefixes.join('|')}\\.(\\w+)`, 'g'));
  const outputFilePath = getOutputFilePath(outputDirectory, outputName, overwritePrevEnv);

  try {
    const envVars = await findEnvVars(directory, exclude);

    if (print) {
      console.table(envVars);
    } else {
      createEnvFile(envVars, outputFilePath);
      console.log('\x1b[36m', 'Output file:', '\x1b[32m', outputFilePath);
    }

    console.log('\x1b[36m', 'Total environment variables found:', '\x1b[32m', envVars.size);
  } catch (err) {
    console.error('Error generating your file:', err);
  }
}

main();
