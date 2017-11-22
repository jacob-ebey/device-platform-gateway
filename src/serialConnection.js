const SerialPort = require('serialport');
const ByteLength = SerialPort.parsers.ByteLength;

const messageParser = require('./messageParser');

const MESSAGE_START = Buffer.from([0]);

module.exports = function(configuration, messageCallback, options = { closedCallback: undefined, debug: false }) {
  const parser = new ByteLength({ length: 1 }); // Read byte per byte
  const serial = new SerialPort(configuration.port, {
    baudRate: configuration.baudRate,
    autoOpen: false,
    parser
  });


  serial.on('open', function() {
    if (options.debug) {
      console.log('\nOpened Port: ' + configuration.port + 'Baud Rate: ' + configuration.baudRate + '\n');
    }
  });

  const messageHandler = messageParser(messageCallback);
  // data is a Buffer that contains a single byte
  serial.on('data', messageHandler);

  serial.on('close', function() {
    if (options.closedCallback) {
      options.closedCallback(configuration);
    }
  });

  serial
    .open((err) => {
      if (options.closedCallback) {
        options.closedCallback(configuration, err);
      }
    })
};
