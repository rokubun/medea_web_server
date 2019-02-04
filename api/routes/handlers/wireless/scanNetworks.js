import logger from '../../../logger';
import wifi from 'node-wifi';

/**
 * GET METHOD
 * Scan All Networks
 */
const scanNetworks = async (req, res) => {
  let currentConnection = null;
  
  wifi.init({
    iface: 'wlan0'
  });

  try {
    const connections = await wifi.getCurrentConnections();
    if (connections) {
      currentConnection = connections[0];
    }
  } catch (error) {
    logger.error('Unable to get the current connection');
  }

  try {
    let networks = await wifi.scan();
    if (!networks) {
      logger.info('Wifi scan, networks not found');
      res.status(404);
    } else {
      logger.info('Wifi scan successfully done');

      if (currentConnection) {
        const byCurrentConnection = (network) => (network.ssid !== currentConnection.ssid);
        networks = networks.filter(byCurrentConnection);
      }
      res.status(200).json(networks);
    }
  } catch (error) {
    logger.error(`Error doing the scan ${error}`);
    res.status(500);
  }
}

export default scanNetworks;
