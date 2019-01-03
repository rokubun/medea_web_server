import { ConfigModel } from '../models/config';

const findConfig = async (name) => {
  let config;

  try {
    config = await ConfigModel.findOne({ name });
  } catch (error) {
    throw new Error(`(Database) ${error.errmsg}`);
  }
  
  return config;
}

export default findConfig;