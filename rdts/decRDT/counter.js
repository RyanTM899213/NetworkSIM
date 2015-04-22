'use strict';

function MyCounter() {

  var v = 0;

  this.dec = function() {
    v -= 1;
  };

  this.val = function() {
    return v;
  };
}

module.exports = MyCounter;
