import * as dotenv from 'dotenv-flow';
import * as dotenvExpand from 'dotenv-expand';

export const loadEnv = () => {
  dotenvExpand.expand(dotenv.config());
};
