import { configsPath } from '../config';

const injectConfigPath = (req, res, next) => {
  req.custom = {};
  if (/ublox/g.test(req.url)) {
    req.custom.type = 'ublox';
    req.custom.configsPath = configsPath.ublox;
  } else {
    req.custom.type = 'rtk';
    req.custom.configsPath = configsPath.rtklib;
  }
  next();
}

export { injectConfigPath };
