/*
 * winston-rsyslog.js: Transport for logging to remote syslog
 *
 * (C) 2013 Fabio Grande
 * MIT LICENCE
 *
 */

var events = require('events'),
    dgram = require('dgram'),
    net = require('net'),
    os = require('os'),
    util = require('util'),
    winston = require('winston'),
    syslevels = winston.config.syslog,
    Transport = winston.Transport;

//
// ### function RSyslog (options)
// #### @options {Object} Options for this instance.
// Constructor function for the RSyslog transport object responsible
// for send messages to SysLog daemon
//
var Rsyslog = exports.Rsyslog = function (options) {
  options = options || {};
  Transport.call(this, options);
  
  this.name     = 'rsyslog';
  this.host     = options.host   || 'localhost';
  this.port     = options.port   || 514;
  this.facility = options.facility || 0;
  this.protocol = options.protocol || "U";
  this.hostname = options.hostname || os.hostname();
  this.tag      = options.tag || 'winston';
  
  if (this.facility > 23 || this.facility < 0) {
    throw new Error('Facility index is out of range (0..23) !');
  }

  if (this.protocol != "U" && this.protocol != "T") {
    throw new Error('Undefined Protocol (valid options are U or T) !');
  }

  
};

//
// Inherit from `winston.Transport`.
//
util.inherits(Rsyslog, winston.Transport);

//
// Add a new property to expose the new transport....
//
winston.transports.Rsyslog = Rsyslog;

//
// Expose the name of this Transport on the prototype
//
Rsyslog.prototype.name = 'rsyslog';

//
// ### function log (level, msg, [meta], callback)
// #### @level {string} Level at which to log the message.
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Additional metadata to attach
// #### @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Winston. Metadata is optional.
//
Rsyslog.prototype.log = function (level, msg, meta, callback) {
  if (this.silent) {
    return callback(null, true);
  }

  var self = this;

  // If the specified level is not included in syslog list, convert it into "debug".
  var _severity = 7;
  if (syslevels["levels"][level] !== undefined)
  {
    _severity = syslevels["levels"][level];
  }

  var _pri = (this.facility << 3) + _severity;
  var _date = new Date().toISOString();
  var _buffer = new Buffer("<" + _pri + ">" + _date + " " + this.hostname +
                           " " + this.tag + " " + process.pid + " - " + level +
                           " - " + msg);
  
  if (this.protocol == "U") {
    var client = dgram.createSocket("udp4");
    client.send(_buffer, 0, _buffer.length, this.port, this.host, function(err, bytes) {
      if (err)
      {
        throw err;
      }

      self.emit('logged');

      if (callback) callback(null, true);
      callback = null;

      client.close();
    });
  }
  
  if (this.protocol == "T") {
    var socket = net.connect(this.port, this.host, function() {
      socket.end(_buffer + "\n");

      self.emit('logged');

      if (callback) callback(null, true);
      callback = null;

    });
    
    socket.setTimeout(2000);
    
    socket.on("error", function(err) {
      socket.close();
      throw err;
    });

    socket.on("timeout", function(err) {
      socket.close();
      throw err;
    });
    
  }
  
};
