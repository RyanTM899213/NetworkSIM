'use strict';

function Counter() {

  var v = 0;

  this.inc = function() {
    v += 1;
  };

  this.val = function() {
    return v;
  };
}

module.exports = Counter;
