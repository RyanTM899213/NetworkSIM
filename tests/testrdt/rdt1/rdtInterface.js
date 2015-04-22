var Counter = require('./counter');

exports.init = function(networkIterator, deviceIterator) {
  while (deviceIterator.hasNext()) {
    deviceIterator.next().replicateRDT(new Counter());
  }
};

