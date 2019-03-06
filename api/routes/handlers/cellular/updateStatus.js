import { execSync } from "child_process";
import Joi from 'joi';

/**
 * PUT METHOD
 * It starts or stops the cellular connection
 */
const updateStatus = (req, res, next) => {
  const path = '/root/medea_web_server/scripts';
  const { newStatus } = req.body;

  const schema = Joi.object().keys({
    newStatus: Joi.boolean().required(),
  }).unknown();

  const validation = Joi.validate(req.body, schema);

  if (validation.error) {
    return res.status(400).json({ message: `Bad request ${validation.error.details[0].message}` });
  }

  try {
    if (newStatus) {
      execSync(`${path}/start_sara.sh`);
    } else {
      execSync(`${path}/stop_sara.sh`);
    }
    res.status(200).json({ changed: true });
  } catch (err) {
    next(err);
  }

}

export default updateStatus;