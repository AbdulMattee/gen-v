import { statSync, readFileSync } from 'fs';
import { globSync } from 'glob';

export function findEnvVars(directory: string, excludeFolders: string[], envPatterns: RegExp[]): Set<string> {
  const envVars = new Set<string>();
  const excludedFolders = excludeFolders.map((folder) => `${directory}/${folder}/**`);
  const filesToSearch = `${directory}/**/*.{js,ts}`;

  const foundFiles = globSync(filesToSearch, { ignore: excludedFolders });

  for (const file of foundFiles) {
    const stats = statSync(file);

    if (stats.isFile()) {
      const content = readFileSync(file, 'utf8');

      for (const pattern of envPatterns) {
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(content)) !== null) {
          envVars.add(match[1]);
        }
      }
    }
  }

  return envVars;
}
