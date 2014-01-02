# winston-rsyslog

An [Rsyslog][0] transport for [winston][1].

## Usage
``` js
  var winston = require('winston');
  
  //
  // Requiring `winston-rsyslog` will expose 
  // `winston.transports.Rsyslog`
  //
  require('winston-rsyslog');
  
  winston.add(winston.transports.Rsyslog, options);
```

The Rsyslog transport takes the following options:

* __level:__ Level of messages that this transport should log.
* __host:__ Host where rsyslog runs (default : localhost)
* __port:__ RSysLog Port (default : 514)
* __facility:__ Facility index (default 0, valid values are from 0 to 23)
* __protocol:__ TCP or UDP (values can be "U" or "T", default is "U")

Through __facility__ parameter, You'll be able to use the right log file on rsyslog:

```
__0__  kernel messages
__1__  user-level messages
__2__  mail system
__3__  system daemons
__4__  security/authorization messages
__5__  messages generated internally by syslogd
__6__  line printer subsystem
__7__  network news subsystem
__8__  UUCP subsystem
__9__  clock daemon
__10__ security/authorization messages
__11__ FTP daemon
__12__ NTP subsystem
__13__ log audit
__14__ log alert
__15__ clock daemon (note 2)
__16__ local use 0 (local0)
__17__ local use 1 (local1)
__18__ local use 2 (local2)
__19__ local use 3 (local3)
__20__ local use 4 (local4)
__21__ local use 5 (local5)
__22__ local use 6 (local6)
__23__ local use 7 (local7)
```

## Enabling rsyslog
To let rsyslog receive data through UDP port, You should change its configuration (tipically located in /etc/rsyslog.conf), enabling the following tags:

```
$ModLoad imudp
$UDPServerRun 514
```

The first tag enable UDP reception, while the second one define the listening port.

To enable TCP reception on port 10514 (as an example) :

```
$ModLoad imtcp
$InputTCPServerRun 10514
```

## Motivation
Just for fun, while learning NodeJS.
This (simple) project is based on [winston-loggly][2] (thanks @indexzero for the inspiration). 

## Installation

### Installing npm (node package manager)

``` bash
  $ curl http://npmjs.org/install.sh | sh
```

### Installing winston-rsyslog

``` bash
  $ npm install winston
  $ npm install winston-rsyslog
```

## Run Tests
All of the winston tests are written in [vows][3], and cover all of the use cases described above. 
To configure the destination rsyslog daemon parameters, copy the test/config.example.json file into test/config.json and modify it to suite Your needs.
If no test/config.json file is found, defaults will be used.

``` js
  {
    "transports": {
      "rsyslog": {
        "host": "localhost",
        "port": "514",
        "facility": "0",
        "protocol": "U"
      }
    } 
  }
```

Then you can run tests with [npm][4]:

```
  npm test
```

#### Author: [Fabio Grande] (http://about.me/fgrande)
#### License: MIT

[0]: http://en.wikipedia.org/wiki/Rsyslog
[1]: https://github.com/flatiron/winston
[2]: https://github.com/indexzero/winston-loggly
[3]: http://vowsjs.org
[4]: http://npmjs.org
