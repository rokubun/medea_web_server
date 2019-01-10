import request from 'supertest';
import app from '../server';

import process from 'process';

import { assert, expect } from 'chai';
import fs from 'fs';


console.log('\tRoutes Tests');
console.log('-----------------------------');


/**
 * Welcome
 */
describe('GET / [getWelcome]', () => {
  it('should respond with html', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'application/html')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
});


/**
 * Status methods to open/close or check rtklib
 */

/**
* Check RTK state
*/
describe('GET /status [getStatus]', () => {
  it('should respond with json', (done) => {
    request(app)
      .get('/status')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        assert.isBoolean(response.body.state, 'state');
        done();
      })
      .catch(error => {
        console.log('\t' + error.message);
      });
  });
});

/**
* Change RTK state (Turn ON/OFF)
*/
describe('PUT /status [changeStatus]', () => {
  it('should respond with json', (done) => {
    request(app)
      .put('/status')
      .send({ data: { state: true }})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

const randomFile = `random_file_${Math.floor(Math.random() * 9999).toString()}`;

/**
 * Configs methods
 */

// Placeholder configName to test the http methods
const configFile = 'test_this_please.conf';

const rtkConfigData = fs.readFileSync(`${__dirname}/defaults/defaults_test.conf`).toString();

describe('GET /storage [getActualConfig]', () => {
  it('(code 200) should get the actual config in use', (done) => {
    request(app)
      .get('/storage')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('PUT /storage [updateCurrentConfig]', () => {
  it('(code 200) should update the current config', (done) => {
    request(app)
      .put('/storage/name/default.conf')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('(code 404) should NOT find a config to update', (done) => {
    request(app)
      .put(`/storage/name/${randomFile}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});


describe('POST /rtklib/config [addConfig]', () => {
  it('(code 200) upload a normal file in base64', (done) => {
    request(app)
    .post('/rtklib/config')
    .send({
      file: {
        name: configFile,
        data: 'pos1-posmode=movingbase'.toString('base64'),
      }
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });

  it('(code 400) upload without values', (done) => {
    request(app)
      .post('/rtklib/config')
      .send({
        file: {}
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('(code 409) upload a file with a name taken', (done) => {
    request(app)
      .post('/rtklib/config')
      .send({
        file: {
          name: configFile,
          data: 'pos1-posmode=movingbase'.toString('base64'),
        }
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(409)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('PUT /rtklib/config [editConfig]', () => {
  it('(code 200) should edit the config', (done) => {
    request(app)
    .put(`/rtklib/config/name/${configFile}`)
    .set('Accept', 'application/json')
    .send({
      configs: rtkConfigData,
    })
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
  
  it('(code 404) should not find the config', (done) => {
    request(app)
    .put(`/rtklib/config/name/${randomFile}`)
    .set('Accept', 'application/json')
    .send({
      configs: rtkConfigData,
    })
    .expect('Content-Type', /json/)
    .expect(404, done);
  });
  
  it('(code 400) should respond with bad request', (done) => {
    request(app)
    .put(`/rtklib/config/name/${configFile}`)
    .set('Accept', 'application/json')
    .send({
      configs: '',
    })
    .expect('Content-Type', /json/)
    .expect(400, done);
  });
  
  it('(code 400) should respond with bad request', (done) => {
    request(app)
    .put(`/rtklib/config/name/${configFile}`)
    .set('Accept', 'application/json')
    .send({
      configs: 'hello i\'m a fantastic dinosaur',
    })
    .expect('Content-Type', /json/)
    .expect(400, done);
  });

  it('(code 400) should respond with bad request', (done) => {
    request(app)
      .put(`/rtklib/config/name/${configFile}`)
      .set('Accept', 'application/json')
      .send({
        configs: 'test       =test',
      })
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('(code 400) should respond with bad request using default.conf', (done) => {
    request(app)
      .put(`/rtklib/config/name/default.conf`)
      .set('Accept', 'application/json')
      .send({
        configs: rtkConfigData,
      })
      .expect('Content-Type', /json/)
      .expect(400, done);
  });
});

describe('DEL /rtklib/config [delConfig]', () => {
  it('(code 200) should delete a config', (done) => {
    request(app)
    .delete(`/rtklib/config/name/${configFile}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
  
  it('(code 404) should not find a config to delete', (done) => {
    request(app)
    .delete(`/rtklib/config/name/${configFile}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(404, done);
  });
});

describe('GET /rtklib/configs [getAllConfigs]', () => {
  it('(code 200) should get all configs from db', (done) => {
    request(app)
    .get('/rtklib/configs')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

/* Ublox methods */

const ubloxFile = 'test@10Hz.txt';

const ubloxConfigData = fs.readFileSync(`${__dirname}/defaults/rok@10Hz.txt`).toString();

describe('POST ublox/config [addConfig]', () => {
  it('(code 200) upload a normal file in base64', (done) => {
    request(app)
    .post('/ublox/config')
    .send({
      file: {
        name: ubloxFile,
        data: ubloxConfigData,
      }
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
  
  it('(code 409) upload a file with a name taken', (done) => {
    request(app)
      .post('/ublox/config')
      .send({
        file: {
          name: ubloxFile,
          data: ubloxConfigData,
        }
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(409)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('PUT ublox/bin [loadConfig]', () => {
  it('(code 200) should load the config', (done) => {
    request(app)
      .put(`/ublox/bin/name/${ubloxFile}`)
      .send({
        type: 'ublox'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('(code 404) should NOT load the config using a wrong name', (done) => {
    request(app)
      .put(`/ublox/bin/name/${randomFile}`)
      .send({
        type: 'ublox'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});

describe('DEL ublox/config [delConfig]', () => {
  it('should respond with json and code 200', (done) => {
    request(app)
      .delete(`/ublox/config/name/${ubloxFile}`)
      .send({
        type: 'ublox'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should respond with json and code 404', (done) => {
    request(app)
      .delete(`/ublox/config/name/${ubloxFile}`)
      .send({
        type: 'ublox'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});

describe('GET ublox/configs [getAllConfigs]', () => {
  it('should respond with json', (done) => {
    request(app)
      .get('/ublox/configs')
      .send({
        type: 'ublox',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});


/* Wireless Networks */

// describe('GET /wireless/networks [GetAllNetworks]', () => {
//   it('should get all the wireless networks', (done) => {
//     request(app)
//       .get('/wireless/networks')
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200, done);
//   });
// });

// const ssid = process.env.SSID_NAME || 'ssid';
// const password = process.env.SSID_PASS || 'password';

// describe('GET /wireless/network/:ssid [getNetwork]', () => {
//   it('should get a specific network', (done) => {
//     request(app)
//       .get(`/wireless/network/${ssid}`)
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200, done);
//   });

//   it('should NOT get a specific network', (done) => {
//     request(app)
//       .get(`/wireless/network/${randomFile}`)
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(404, done);
//   });
// });

// describe('PUT /wireless/network [useNetwork]', () => {
//   it('should connect to a network', (done) => {
//     request(app)
//       .put('/wireless/network')
//       .send({
//         ssid,
//         password,
//       })
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200, done)
//   });

//   it('should NOT found the network', (done) => {
//     request(app)
//       .put('/wireless/network')
//       .send({
//         randomFile,
//         randomFile,
//       })
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(404, done)
//   });

//   it('should responds with a bad request', (done) => {
//     request(app)
//       .put('/wireless/network')
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(400, done)
//   });
// });


// /* Tethering */

// describe('GET /tethering/status [getStatus]', () => {
//   it('should get the tethering status', (done) => {
//     request(app)
//       .get('/tethering/status')
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200, done);
//   });
// });

// describe('PUT /tethering/status [useTethering]', () => {
//   it('should turn off tethering', (done) => {
//     request(app)
//       .put('/tethering/status')
//       .send({
//         state: false,
//       })
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200, done);
//   });

//   it('should turn on tethering', (done) => {
//     request(app)
//       .put('/tethering/status')
//       .send({
//         state: true,
//       })
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200, done);
//   });
// });