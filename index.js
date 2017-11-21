const configuration = require('./configuration');
const serialConnection = require('./src/serialConnection');

function handleMessage(message) {
  // Pretty print the object to the console
  console.log(JSON.stringify(message, null, 2));
}

function handleClosed(config, err) {
  if (err) {
    console.log('\nFailed to open: ' + config.port + '\n')
  } else {
    console.log('\nClosed Port: ' + config.port + '\n')
  }
}

serialConnection(configuration, handleMessage, { closedCallback: handleClosed, debug: true });


console.log('Press any key to exit');

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));
