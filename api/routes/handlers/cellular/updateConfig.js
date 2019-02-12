import Joi from 'joi';
import { execSync } from 'child_process';
import logger from '../../../logger';

/**
 * PUT METHOD
 * It updates the cellular config in network manager profile /etc/NetworkManager/system-connections/cellular
 */
const updateConfig = (req, res) => {
  const schema = Joi.object().keys({
    apn: Joi.string().required(),
    pin: Joi.number().required(),
    user: Joi.string(),
    password: Joi.string(),
  });
  
  const validation = Joi.validate(req.body, schema);

  if (validation.error) {
    return res.status(400).json({ message: `Bad request ${validation.error.details[0].message}` });
  } 

  let commandStr = 'nmcli con mod cellular';

  const keys = Object.keys(req.body);
  console.log(keys)
  const values = Object.values(req.body);
  console.log(values)

  try {
    keys.forEach((key, i) => {
      console.log(`${commandStr} gsm.${key} "${values[i]}"`);
      execSync(`${commandStr} gsm.${key} "${values[i]}"`);
    });
    console.log('test')
    res.status(200);
  } catch (err) {
    logger.error(err);
    res.status(500);
  }
}

export default updateConfig;
