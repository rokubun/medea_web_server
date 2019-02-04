import wifi from 'node-wifi';

import Joi from 'joi';
import logger from '../../../logger';

/**
 * POST METHOD
 * Connects to a network sent by an user
 * It needs the ssid and the password
 */
const connectToNetwork = (req, res) => {
  wifi.init({
    iface: 'wlan0',
  });

  const schema = Joi.object().keys({
    ssid: Joi.string().required(),
    password: Joi.string().required(),
  });

  console.log(req.body)

  const validation = Joi.validate(req.body, schema);

  if (validation.error) {
    return res.status(400).json({ message: `Bad Request ${validation.error.details[0].message}` });
  }

  const ap = {
    ssid: req.body.ssid,
    password: req.body.password
  }

  wifi.connect(ap).then(() => {
    logger.info({ message: 'Successfully connected' })
    res.status(200).json({ message: 'Successfully connected' });
  }).catch((error) => {
    logger.info({ message: 'Unable to connect' })
    res.status(404);
  });
}

export default connectToNetwork;
