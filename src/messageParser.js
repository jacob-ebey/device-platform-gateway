/*
 * Message Format (This doesn't match what's in the testMessage.txt)
 * 
 * a: 1 byte target ID
 * b: 1 byte slave comm param (set config)
 * c: 1 byte device count
 * d: 1 byte controller count
 * e: Array of controllers:
 *   e1: 1 byte device ID
 *   e2: 1 byte schedule count
 *     e2.1: 1 byte date?
 *     e2.2: 1 byte state
 */

// Define steps here to keep code below readable/understandable
const PARSE_STEPS = {
  parseId: 0,
  parseSlaveComParam: 1
  /// ... More steps defined here
};

// Define constants here (see below)

module.exports = function (messageCallback, exceptionCallback) {
  if (!messageCallback) {
    throw new Error('Param messageCallback is required');
  }

  // Constants for comparing to incoming bytes are defined as buffers with a single value:
  //   const CONST_VAL = new Buffer([224])
  // These constants are defined above the module.exports
  //
  // Comparison in the function below would then look like:
  //   if (data.compare(CONST_VAL) === 0) {
  //
  // To get the direct value of the byte, do:
  //   data[0]
  //
  // To a multi-byte value (int, float, etc.), compile the individual bytes in a buffer and use
  // one of the methods documented here: https://nodejs.org/api/buffer.html 

  // Variables you need to define go here
  let currentMessage = {};
  let currentParseStep = PARSE_STEPS.parseId;
  let done = false;

  return function (data) {
    try {
      // TODO: Implement the message parsing byte per byte here. I'd recommend a state machine like shown
      switch (currentParseStep) {
        case PARSE_STEPS.parseId:
          currentMessage.id = data[0];
          currentParseStep = PARSE_STEPS.parseSlaveComParam;
          break;
        
        case PARSE_STEPS.parseSlaveComParam:
          currentMessage.slaveComParam = data[0];
          done = true;
          break;
      
        // Should never need the default case. Keep track of the current step and expect to always hit a case
        default:
          const err = new Error('Hit unknown parsing case');
          if (errCallback) {
            errCallback(err)
          } else {
            throw err;
          }
          break;
      }

      if (done) {
        // Send the compiled message to the callback
        messageCallback(currentMessage);

        // Reset the vaiables used in compiling the message
        currentMessage = {};
        currentParseStep = PARSE_STEPS.parseId;
        done = false;
      }
    } catch (ex) {
      if (errCallback) {
        errCallback(ex);
      } else {
        throw ex;
      }
    }
  }
}