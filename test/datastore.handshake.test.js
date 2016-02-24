'use strict';

let assert = require('assert');
let fs = require('fs');
let path = require('path');
let echo = require('./support/echo-server');
let supertest = require('supertest');
let microgw = require('../lib/microgw');
let apimServer = require('./support/mock-apim-server2/apim-server');

describe('handshake', function() {
  let request;
  before((done) => {
    process.env.APIMANAGER = '127.0.0.1';
    process.env.APIMANAGER_PORT = 5555;
    process.env.APIMANAGER_CATALOG = 1234;
    process.env.NODE_ENV = 'production';
    apimServer.start()
      .then(() => microgw.start(3000))
      .then(() => {
        request = supertest('https://localhost:5555');
      })
      .then(done)
      .catch((err) => {
        console.error(err);
        done(err);
      });
  });

  after((done) => {
    delete process.env.APIMANAGER;
    delete process.env.APIMANAGER_PORT;
    delete process.env.APIMANAGER_CATALOG;
    delete process.env.NODE_ENV;

    microgw.stop()
      .then(() => apimServer.stop())
      .then(done, done)
      .catch(done);
  });
  
  
  it('Check handshake part 1 (did we send correct info in POST)',
    function(done) {
      request
        .get('/results/test1')
        .expect(200)
        .expect(function(res) {
            assert(res.body === true); // ID should be same as previous
          }
        ).end(done);
    }
  );
 
  it('Check handshake part 2 payload received by micro-gw',
    function(done) {
      request
        .get('/results/test2')
        .expect(200)
        .expect(function(res) {
            assert(res.body === true); // ID should be same as previous
          }
        ).end(done);
    }
  );
  
});
