import Joi from 'joi';
import { execSync } from 'child_process';
import logger from '../../../logger';

/**
 * PUT METHOD
 * It updates the cellular config in network manager profile /etc/NetworkManager/system-connections/cellular
 */
const updateConfig = (req, res, next) => {
  const schema = Joi.object().keys({
    apn: Joi.string().required(),
    pin: Joi.number().allow(''),
    user: Joi.string().allow(''),
    password: Joi.string().allow(''),
  });
  console.log(req.body)
  const validation = Joi.validate(req.body, schema);

  if (validation.error) {
    console.log('validation error ', validation.error.details[0]);
    return res.status(400).json({ message: `Bad request ${validation.error.details[0].message}` });
  } 

  
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);
  
  const { apn } = req.body;
  
  // delete con cellular
  try {
    execSync('nmcli con del cellular');
  } catch (err) {
    logger.error('deleting NM cellular profile');
  }
  
  
  try {
    execSync(`nmcli c add type gsm ifname ttyACM0 con-name cellular apn ${apn}`);
    execSync(`nmcli con mod cellular connection.autoconnect yes`);
    keys.forEach((key, i) => {
      let commandStr = 'nmcli con mod cellular';
      if (key) {
        execSync(`${commandStr} gsm.${key} "${values[i]}"`);
      }
    });
    res.status(200);
  } catch (err) {
    next(err);
  }
}

export default updateConfig;
