const request = require('supertest');
const app = require('../server');
const { assert, expect } = require('chai');
const fs = require('fs');


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


/**
 * Configs methods
 */

// Placeholder configName to test the http methods
const configFile = 'test_this_please.conf';

const defaultData = fs.readFileSync(`${__dirname}/defaults_test.conf`).toString();

describe('GET /config [getActualConfig]', () => {
  it('should respond with json', (done) => {
    request(app)
      .get('/config')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});


describe('POST /config [addConfig]', () => {
  it('should respond with json', (done) => {
    request(app)
    .post('/config')
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
});


describe('PUT /config [editConfig]', () => {
  it('should respond with json and code 200', (done) => {
    request(app)
      .put(`/config/name=${configFile}`)
      .set('Accept', 'application/json')
      .send({
        'data': defaultData,
      })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should respond with json and code 404', (done) => {
    const randomFile = `edit_this_${Math.floor(Math.random() * 9999).toString()}.conf`;
    request(app)
      .put(`/config/name=${randomFile}`)
      .set('Accept', 'application/json')
      .send({
        'data': defaultData,
      })
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should respond with json and code 400', (done) => {
    request(app)
      .put(`/config/name=${configFile}`)
      .set('Accept', 'application/json')
      .send({
        'data': '',
      })
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should respond with json and code 400', (done) => {
    request(app)
      .put(`/config/name=${configFile}`)
      .set('Accept', 'application/json')
      .send({
        'data': 'hello i\'m a fantastic dinosaur',
      })
      .expect('Content-Type', /json/)
      .expect(400, done);
  });
})

describe('DEL /config [delConfig]', () => {
  it('should respond with json and code 200', (done) => {
    request(app)
      .delete(`/config/name=${configFile}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should respond with json and code 404', (done) => {
    request(app)
      .delete(`/config/name=${configFile}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});

describe('GET /configs [getAllConfigs]', () => {
  it('should respond with json', (done) => {
    request(app)
      .get('/configs')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
  
