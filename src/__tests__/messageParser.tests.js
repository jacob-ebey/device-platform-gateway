// Import libs to load the test message
const fs = require('fs');
const path = require('path')

// Import the message parser to test
const messageParser = require('../messageParser');

// The message we expect to match the raw bytes in the testMessage.txt
const expectedMessage = {
  // TODO: Fill this in with the values of the test message that are expected
}

// A test container for the message parser
describe('Message parser', () => {
  // An individual test
  it('Can parse test message', (done) => {
    // Load the test file
    fs.readFile(path.resolve(__dirname, 'testMessage.txt'), (err, buffer) => {
      // Turn the buffer into an array then map the individual bytes into their own buffers
      // to simulate how they are passed to the parser
      const data = Array.prototype.slice.call(buffer, 0);      
      const buffers = data.map((byte) => new Buffer([byte]));

      // The callback function that the final message should be passed to
      function messageCallback(message) {
        // TODO: Compare expectedMessage to message
        console.log(message);
        console.log(expectedMessage);

        // Notify jest we are done with the test
        done();
      }

      // Create a parse that handles byte per byte
      const parser = messageParser(messageCallback);

      // Pass all the individual buffers that contain a single byte to the parser
      buffers.forEach((buff) => {
        parser(buff);
      });
    });
  })
});