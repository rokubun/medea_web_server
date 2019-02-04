
import wifi from 'node-wifi';
import logger from '../../../logger';

/**
 * GET METHOD
 * Gets an specific network
 */
const getCurrentNetwork = (req, res) => {
  wifi.init({
    iface: 'wlan0'
  });

  wifi.getCurrentConnections((err, currentConnections) => {
    if (err) {
      logger.error('getting the current connection');
    }
    console.log(currentConnections[0]);
    res.status(200).json(currentConnections[0]);
  });
}

export default getCurrentNetwork;
