type Blame = {
  added: string[];
  removed: string[];
};

type Arguments = {
  directory: string;
  exclude: string;
  prefixes: string;
  name: string;
  output: string;
  overwrite: boolean;
  print: boolean;
  compare: boolean;
  update: boolean;
};
