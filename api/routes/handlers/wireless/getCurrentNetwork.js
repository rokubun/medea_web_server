
import wifi from 'node-wifi';
import logger from '../../../logger';
import { execSync } from 'child_process';

/**
 * GET METHOD
 * Gets an specific network
 */
const getCurrentNetwork = (req, res) => {
  wifi.init({
    iface: 'wlan0'
  });
  
  execSync('nmcli device wifi rescan');
  wifi.getCurrentConnections((err, currentConnections) => {
    console.log(currentConnections);
    if (err) {
      logger.error('getting the current connection');
      res.status(500);
    } else if (currentConnections.length === 0) {
      res.status(404).json({ connection: null });
    } else {
      res.status(200).json({ connection: currentConnections[0] });
    }
  });
}

export default getCurrentNetwork;
