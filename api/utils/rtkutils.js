/**
 * Returns an object 
 * @param {string} data
 * @return {object}
 */
export const parseRtkConfigs = (data) => {
  if (typeof (data) !== 'string') {
    throw Error('Send a string');
  } else if (data.length === 0) {
    throw Error('Don\'t send an empty string');
  }

  const filterHashLines = line => {
    if (line.indexOf('#') !== 0) {
      return line;
    }
  }

  const cleanLines = line => {
    const lineClean = line.replace(/\s/g, '');
    if (line.indexOf('#') !== 0) {
      lineClean.substr(0, lineClean.indexOf('#'));
    }
    return lineClean;
  }

  const dataSplitted = data.split('\n');
  const oData = {};
  const dataFiltered = dataSplitted.filter(filterHashLines).map(cleanLines);

  dataFiltered.forEach(line => {
    line = line.split('=');
    oData[line[0]] = line[1];
  });

  return oData;
}

export const isRtkConfig = (data) => {
  if (typeof (data) !== 'string') {
    throw Error(`cannot use a ${typeof (data)}, instead pass a string`);
  } else if (data.length === 0) {
    throw Error('cannot check an empty string');
  }
  return /[a-z-A-Z-0-9-(). #=,:]/.test(data);
}