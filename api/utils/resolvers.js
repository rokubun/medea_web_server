import whitelist from 'validator/lib/whitelist';

export const resolveClientIp = (req) => {
  let ipAddress;
  // The request may be forwarded from local web server.
  const forwardedIpsStr = req.header('x-forwarded-for');
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    const forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // If request was not forwarded
    ipAddress = req.connection.remoteAddress;
  }
  const ipAddressSanitized = whitelist(ipAddress, '\\[0-9\.\\]'); //^[0-9\.\-\/]+$)
  return ipAddressSanitized;
};
