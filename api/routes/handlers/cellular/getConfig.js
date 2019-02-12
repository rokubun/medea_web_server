import logger from "../../../logger";

import { execSync } from 'child_process';

/**
 * GET METHOD
 * It gets the cellular config in network manager profile /etc/NetworkManager/system-connections/cellular
 */
const getConfig = (req, res) => {
  const dictionary = [ 'username', 'password', 'apn', 'pin' ];

  try {
    const output = execSync('nmcli --terse -s --fields gsm con show cellular').toString();
    const values = output.replace(/gsm.|--/g, '').split(/:|\n/);

    const config = values.reduce((acc, str, i) => {
      if (dictionary.indexOf(str) !== -1) {
        acc[str] = values[i + 1];
      } 
      return acc;
    }, {});

    res.status(200).json({ config });
  } catch (err) {
    logger.error(err);
    res.status(500);
  }
}

export default getConfig;
