/**
 * Returns an object 
 * @param {string} data
 * @return {object}
 */
export const rtkSettingsToObject = (data) => {
  if (typeof (data) !== 'string') {
    throw Error('Send a string');
  } else if (data.length === 0) {
    throw Error('Don\'t send an empty string');
  }

  const clearComments = line => {
    const hashPosition = line.indexOf('#')
    if (hashPosition >= 0) {
      line = line.substr(0, hashPosition);
    }
    return line;
  }
  const clearSpaces = (line) => (line.replace(/\s/g, ''));
  
  const clearEmpties = (line) => {
    if (line.length) {
      return line;
    }
  }

  const dataSplitted = data.split('\n');
  const dataFiltered = dataSplitted
    .map(clearComments)
    .map(clearSpaces)
    .filter(clearEmpties);

  const oData = {};

  // "push" keys and values to oData
  // output : value1: "value2"
  dataFiltered.forEach(line => {
    line = line.split('=');
    oData[line[0]] = line[1];
  });

  return oData;
}

/**
 * Converts the rtk params as json format to rtklib text format
 * @param {string} data
 * @return {string}
 */
export const jsonToRtkSettings = (json) => {
  if (typeof (json) !== 'string') {
    throw '(jsonToRtk) Please send a string';
  } else if (json.length === 0) {
    throw '(jsonToRtk) Don\'t send an empty string';
  }

  const rtkParameters = JSON.parse(json);
  const rtKeys = Object.keys(rtkParameters);
  const rtkValues = Object.values(rtkParameters);
  
  const rtkFormat = rtKeys.map((key, i) => (`${key}=${rtkValues[i]}`));
  
  return rtkFormat.join('\n');
}

export const isRtkConfig = (data) => {
  if (typeof (data) !== 'string') {
    throw Error(`cannot use a ${typeof (data)}, instead pass a string`);
  } else if (data.length === 0) {
    throw Error('cannot check an empty string');
  }
  return /[a-z-A-Z-0-9-(). #=,:]/.test(data);
}