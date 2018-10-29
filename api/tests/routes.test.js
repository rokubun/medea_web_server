import request from 'supertest';
import app from '../server';

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
        assert.isBoolean(response.body.isOpen, 'isOpen');
        assert.isBoolean(response.body.isRunning, 'isRunning');
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
  it('should respond with json', (done) => {
    request(app)
      .get('/storage')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('PUT /storage [editCurrentConfig]', () => {
  it('should edit the current config (code 200)', (done) => {
    request(app)
      .put('/storage/name/default.conf')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should NOT edit the current config (code 404)', (done) => {
    request(app)
      .put(`/storage/name/${randomFile}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});


describe('POST /rtklib/config [addConfig]', () => {
  it('upload a normal file in base64 (code 200)', (done) => {
    request(app)
    .post('/rtklib/config')
    .send({
      file: {
        name: configFile,
        data: 'dGVzdA==',
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

  it('upload a file with a name taken (code 409)', (done) => {
    request(app)
      .post('/rtklib/config')
      .send({
        file: {
          name: configFile,
          data: 'dGVzdA==',
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
  
  it('should respond with json and code 404', (done) => {
    request(app)
    .put(`/rtklib/config/name/${randomFile}`)
    .set('Accept', 'application/json')
    .send({
      configs: rtkConfigData,
    })
    .expect('Content-Type', /json/)
    .expect(404, done);
  });
  
  it('should respond with json and code 400', (done) => {
    request(app)
    .put(`/rtklib/config/name/${configFile}`)
    .set('Accept', 'application/json')
    .send({
      configs: '',
    })
    .expect('Content-Type', /json/)
    .expect(400, done);
  });
  
  it('should respond with json and code 400', (done) => {
    request(app)
    .put(`/rtklib/config/name/${configFile}`)
    .set('Accept', 'application/json')
    .send({
      configs: 'hello i\'m a fantastic dinosaur',
    })
    .expect('Content-Type', /json/)
    .expect(400, done);
  });
});

describe('DEL /rtklib/config [delConfig]', () => {
  it('should respond with json and code 200', (done) => {
    request(app)
    .delete(`/rtklib/config/name/${configFile}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
  
  it('should respond with json and code 404', (done) => {
    request(app)
    .delete(`/rtklib/config/name/${configFile}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(404, done);
  });
});

describe('GET /rtklib/configs [getAllConfigs]', () => {
  it('should respond with json', (done) => {
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
  it('upload a normal file in base64 (code 200)', (done) => {
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
  
  it('upload a file with a name taken (code 409)', (done) => {
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
  it('(code 200) should load the config and respond with json', (done) => {
    request(app)
      .put(`/ublox/bin/name/${ubloxFile}`)
      .send({
        type: 'ublox'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('(code 404) should NOT load the config and respond with json', (done) => {
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