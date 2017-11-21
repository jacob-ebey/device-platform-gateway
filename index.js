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

console.log('Press any key to exit');

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));
