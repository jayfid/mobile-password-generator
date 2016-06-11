// @file - pwGenerator and pwGeneratorKeyboard classes and methods
// generates a password based on optimized keyboard context switching
//

/* ==============
   pwGeneratorKeyboard Class
   ============== */

// store a mobile keyboard layout
// @param - id - string - required - unique system name
// @param - label - string - required - human language name
// @return - new pwGeneratorKeyboard
var pwGeneratorKeyboard = function(id, label) {
  'use strict';
  // validate params
  if (!id || !label || 'string' !== typeof id || 'string' !== typeof label) {
    throw "pwGeneratorKeyboard requires a valid id and label";
  }
  this.id = id;
  this.label = label;
  this.contexts = [];
  this.currentContext = null;
};

// add/update context in lists of contexts
// @param - id - string - required - unqiue id
// @param - characters - Array[char] - list of available characters
// @param - next - Array[string] - list of ids of next possible contexts
// @return - true
pwGeneratorKeyboard.prototype.addContext = function(id, characters, next) {
  'use strict';
  // validate params
  if (!id || 'string' !== typeof id) {
    throw "Invalid parameter. id must be a string.";
  }
  if (!characters || 'object' !== typeof characters || !characters.length) {
    throw "Invalid parameter. characters must be an array of strings";
  }
  // loose check that characters is a list of single character strings
  for (var j = 0, k = characters.length; j < k; j++) {
    if (!characters[j] || 'string' !== typeof characters[j] || 1 !== characters[j].length) {
      throw "Invalid parameter. characters must be an array of strings";
    }
  }
  if (!next || 'object' !== typeof next || !next.length) {
    throw "Invalid parameter. next must be an array of strings";
  }
  for (var l = 0, m = next.length; l < m; l++) {
    if (!next[l] || 'string' !== typeof next[l]) {
      throw "Invalid parameter. next must be an array of strings";
    }
  }

  var context = {
    id: id,
    characters: characters,
    next: next
  };

  // if this context id is taken, update the existing entry
  for (var i = 0, len = this.contexts.length; i < len; i++) {
    if (this.contexts[i].id === id) {
      this.contexts[i] = context;
      return true;
    }
  }

  // add context to array
  this.contexts.push(context);

  // set a default context if none is set
  if ( this.currentContext === null ) {
    this.currentContext = context;
  }
  return true;
};

// return context with given id
// @param - id - string - required
// @return - context object with given id
pwGeneratorKeyboard.prototype.getContextById = function(id) {
  'use strict';
  for (var i = 0, len = this.contexts.length; i < len; i++) {
    if (id === this.contexts[i].id) {
      return this.contexts[i];
    }
  }
  throw "Keyboard with supplied id does not exist";
};

/* ==============
   pwGenerator Class
   ============== */

// generate passwords based on optimized keyboard context switching
// @return - new pwGenerator
var pwGenerator = function() {
  'use strict';
  this.reset();

  // initialize keyboards
  this.keyboards = [];
  this.addiPhoneKeyboad();
};

// add default keyboard
// @return - void
pwGenerator.prototype.addiPhoneKeyboad = function() {
  'use strict';
  var iPhoneKeyboard = new pwGeneratorKeyboard('iphone456', 'iPhone 4/5/6');
  iPhoneKeyboard.addContext('alpha_lowercase', ['a', 'b'], ['alpha_uppercase']);
  iPhoneKeyboard.addContext('alpha_uppercase', ['A', 'B'], ['symbol_1']);
  iPhoneKeyboard.addContext('symbol_1', ['1', '2'], ['alpha_lowercase']);
  this.addKeyboard(iPhoneKeyboard);
};

// return keyboard object from id if exists
// @param - id - string - required
// @return - pwGeneratorKeyboard
pwGenerator.prototype.getKeyboardById = function(id) {
  'use strict';
  for (var i = 0, len = this.keyboards.length; i < len; i++) {
    if (id === this.keyboards[i].id) {
      return this.keyboards[i];
    }
  }
  throw "Keyboard with supplied id does not exist";
};

// append or replace keyboard to list of keyboards
// @param - keyboard - pwGeneratorKeyboard - required
// @return - true
pwGenerator.prototype.addKeyboard = function(keyboard) {
  console.log(keyboard.constructor);
  if (keyboard.constructor !== pwGeneratorKeyboard) {
    throw "pwGenerator expects pwGeneratorKeyboard type";
  }

  // if keyboard with matching id already exists, replace it
  for (var i = 0, len = this.keyboards.length; i < len; i++) {
    if (keyboard.id === this.keyboards[i].id) {
      this.keyboards[i] = keyboard;
      return true;
    }
  }

  this.keyboards.push(keyboard);
  return true;
};

// return an array in the form [0, 1, 2, ..., len -1]
// @param - length -  uint - required
// @return - incremental array of ints from 0 to length non-inclusive
pwGenerator.prototype.generateLinearNumericArray = function(length) {
  'use strict';
  var i = 0,
    linearNumericArray = [];
  while (i++ < length) {
    linearNumericArray.push(i);
  }
  return linearNumericArray;
};

// generate a uint as randomly as possible
// @return - uint in Uint32's possible range
pwGenerator.prototype.getRandomInt = function() {
  'use strict';
  // fallback in case of IE 11
  var cryptoObj = window.crypto || window.msCrypto || false;
  if (cryptoObj && cryptoObj.getRandomValues) {
    var intArray = new Uint32Array(1);
    cryptoObj.getRandomValues(intArray);
    return intArray[0];
  } else {
    // fallback to using Math.random
    return Math.floor(Math.random() * 4294967295);
  }
};

// return random number below non-inclusive limit
// @param - limit - uint - required
// @return - uint < $limit
pwGenerator.prototype.getRandomIntWithLimit = function(limit, count) {
  'use strict';
  // check if limit is a positive int.
  if (limit !== parseInt(limit, 10) || limit < 1) {
    throw "getRandomIntWithLimit expects limit to be positive integer";
  }

  return this.getRandomInt() % limit;
};

// return array of sorted units < $limit
pwGenerator.prototype.getArrayRandomIntsWithLimit = function(limit, count) {
  'use strict';
  if (!count || count !== parseInt(count, 10) || count < 1) {
    throw "getArrayRandomIntsWithLimit expects limit to be positive integer";
  }

  var randomNumArray = [];
  while (count--) {
    randomNumArray.push(this.getRandomInt() % limit);
  }
  // js arrays lack a builtin numeric sort method
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  return randomNumArray.sort(function(a, b) {
    return a - b;
  });
};

pwGenerator.prototype.setCurrentKeyboard = function(keyboard) {
  'use strict';
  this.currentKeyboard = keyboard;
  this.currentContext = this.currentKeyboard.getContext();
};

pwGenerator.prototype.reset = function() {
  'use strict';
  this.currentIndex = 0;
  this.password = '';
  this.currentKeyboard = null;
};

pwGenerator.prototype.generatePassword = function(charLen, keyboardId) {
  'use strict';
  // reset persistent data
  this.reset();

  // number of times to switch contexts during password generation.
  // May make sense to expose this under a "Password Strength toggle"
  var numContextSwitches = 2;

  // make selected keyboard readily available
  this.currentKeyboard = this.getKeyboardById(keyboardId);

  // generate a linear list [0, 1, 2, ..., n] of indices for the password string
  var linearNumericArray = this.generateLinearNumericArray(charLen);

  // generate list of indices where we will switch keyboard context
  var contextSwitchIndices = this.getArrayRandomIntsWithLimit(charLen, numContextSwitches);

  while ( this.currentIndex < charLen ) {

  }
};
