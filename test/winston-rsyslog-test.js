/*
 * winston-rsyslog-test.js: Tests for instances of the Rsyslog transport
 *
 * (C) 2013 Fabio Grande
 * MIT LICENSE
 *
 */

var path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    winston = require('winston'),
    helpers = require('winston/test/helpers'),
    Rsyslog = require('../lib/winston-rsyslog').Rsyslog;

var tokenTransport,
    config;

try {
  config = require('./config');
  
  console.log('Using configuration file test/config.json.');
  
  tokenTransport = new (Rsyslog)({
    host: config.transports.rsyslog.host,
    port: config.transports.rsyslog.port,
    facility: config.transports.rsyslog.facility,
    protocol: config.transports.rsyslog.protocol
  });
}
catch (ex) {
  console.log('Cannot read file test/config.json. Using defaults.');
  tokenTransport = new (Rsyslog)();
}

function assertRsyslog(transport) {
  assert.instanceOf(transport, Rsyslog);
  assert.isFunction(transport.log);
}

vows.describe('winston-rsyslog').addBatch({
  "An instance of the Rsyslog Transport": {
    "should have the proper methods defined": function () {
      assertRsyslog(tokenTransport);
    },
    "the log() method": helpers.testSyslogLevels(tokenTransport, "should log messages to rsyslog", function (ign, err, logged) {
      assert.isNull(err);
      assert.isTrue(logged);
    })
  }
}).export(module);
