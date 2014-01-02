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
0 :  kernel messages
1 :  user-level messages
2 :  mail system
3 :  system daemons
4 :  security/authorization messages
5 :  messages generated internally by syslogd
6 :  line printer subsystem
7 :  network news subsystem
8 :  UUCP subsystem
9 :  clock daemon
10 : security/authorization messages
11 : FTP daemon
12 : NTP subsystem
13 : log audit
14 : log alert
15 : clock daemon (note 2)
16 : local use 0 (local0)
17 : local use 1 (local1)
18 : local use 2 (local2)
19 : local use 3 (local3)
20 : local use 4 (local4)
21 : local use 5 (local5)
22 : local use 6 (local6)
23 : local use 7 (local7)
```

## Enabling rsyslog
To let rsyslog receive data through UDP port, You should change its configuration (tipically located in /etc/rsyslog.conf), enabling the following tags:

``` bash
$ModLoad imudp
$UDPServerRun 514
```

The first tag enable UDP reception, while the second one define the listening port.

To enable TCP reception on port 10514 (as an example) :

``` bash
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
