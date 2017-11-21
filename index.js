const configuration = require('./configuration');
const serialConnection = require('./src/serialConnection');

function handleSerialClosed(config, err) {
  if (err) {
    console.log('\nFailed to open: ' + config.port + '\n')
  } else {
    console.log('\nClosed Port: ' + config.port + '\n')
  }
}

serialConnection(configuration, handleSerialClosed);
