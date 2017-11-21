const SerialPort = require('serialport');
const ByteLength = SerialPort.parsers.ByteLength;

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

  // A buffer to hold the deviceId(byte) and currentValue(float: 4 bytes)
  const MESSAGE_LENGTH = 5;
  const currentMessage = new Buffer(MESSAGE_LENGTH);

  serial.on('data', function(data) {
    // data is a Buffer that contains a single byte
    if (data.compare(MESSAGE_START) === 0) {
      currentMessage = new Buffer(5);
    } else {
      // If constructing the new message is complete
      const newLength = currentMessage.write(data.slice(0, 1));
      if (newLength >= MESSAGE_LENGTH) {
        // Parse the recieved bytes into a message
        const message = {
          deviceId: currentMessage[0],
          value: data.readFloatLE(1)
        };

        // Reset the current message
        currentMessage = new Buffer(MESSAGE_LENGTH);

        if (messageCallback) {
          messageCallback(message);
        }
      }

    }
  });

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
