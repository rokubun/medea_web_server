import User from '../models/user';

/**
 *  Check if the user exists and create it
 */
const createDefaultUser = async () => {
  let result;

  try {
    result = await User.find();
  } catch (err) {
    throw new Error(err);
  }

  if (result.length === 0) {
    const user = new User({
      name: 'admin',
      password: '1234',
      currentConf: 'default.conf',
    });

    try {
      const result = await user.save();
      if (result) {
        logger.info('Admin user created in the db');
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default createDefaultUser;
