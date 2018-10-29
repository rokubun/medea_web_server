import { paths } from '../config';

const injectConfigPath = (req, res, next) => {
  req.custom = {};
  if (/ublox/g.test(req.url)) {
    req.custom.type = 'ublox';
    req.custom.configsPath = paths.ublox;
  } else {
    req.custom.type = 'rtk';
    req.custom.configsPath = paths.rtklib;
  }
  req.custom.rootPath = paths.root;
  next();
}

export { injectConfigPath };
