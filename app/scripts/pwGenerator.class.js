// @file - pwGeneratorUtil, pwGenerator and pwGeneratorKeyboard classes and methods
// generates a password based on optimized keyboard context switching
//

/* ==============
   pwGeneratorUtil Class
   ============== */

// Util class to generate numbers and arrays
// @return - new pwGeneratorUtil
var pwGeneratorUtil = function () {
  'use strict';
  this.instance = null;
};

// return an array in the form [0, 1, 2, ..., len -1]
// @param - length -  uint - required
// @return - incremental array of ints from 0 to length non-inclusive
pwGeneratorUtil.prototype.generateLinearNumericArray = function ( limit, min ) {
  'use strict';
  var i = 0,
    linearNumericArray = [];
  if ( typeof min === 'number' && min === parseInt( min, 10 ) ) {
    i = min;
  }
  while ( i < limit ) {
    linearNumericArray.push( i );
    i++;
  }
  return linearNumericArray;
};

// generate a uint as randomly as possible
// @return - uint in Uint32's possible range
pwGeneratorUtil.prototype.getRandomInt = function () {
  'use strict';
  // fallback in case of IE 11
  var cryptoObj = window.crypto || window.msCrypto || false;
  if ( cryptoObj && cryptoObj.getRandomValues ) {
    var intArray = new Uint32Array( 1 );
    cryptoObj.getRandomValues( intArray );
    return intArray[ 0 ];
  } else {
    // fallback to using Math.random
    return Math.floor( Math.random() * 4294967295 );
  }
};

// return random number below non-inclusive limit
// @param - limit - uint - required
// @return - uint under $limit
pwGeneratorUtil.prototype.getRandomIntWithLimit = function ( limit ) {
  'use strict';
  // check if limit is a positive int.
  if ( limit !== parseInt( limit, 10 ) || limit < 1 ) {
    throw 'getRandomIntWithLimit expects limit to be positive integer';
  }
  return this.getRandomInt() % limit;
};

/*
// generate array of sorted uints under $limit
// @param - limit - uint - required
// @param - count - uint - required
// @return - Array of sorted uints under $limit
pwGeneratorUtil.prototype.getArrayRandomIntsWithLimit = function(limit, count) {
  'use strict';
  // validate params
  if (!count || count !== parseInt(count, 10) || count < 1) {
    throw 'getArrayRandomIntsWithLimit expects limit to be positive integer';
  }
  var randomNumArray = [];
  while (randomNumArray.length < count) {
    randomNumArray.push(this.getRandomIntWithLimit(limit));
  }
  // js arrays lack a builtin numeric sort method
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  return randomNumArray.sort(function(a, b) {
    return a - b;
  });
};
*/

// generate array of unique, sorted uints under $limit
// @param - limit - uint - required
// @param - count - uint - required
// @param - min - uint - optional
// @return - Array of unique sorted uints under $limit
pwGeneratorUtil.prototype.getUniqueRandomIntsWithLimit = function ( limit, count, min ) {
  'use strict';
  // validate params
  var randomNumArray = [];
  if ( !count || count !== parseInt( count, 10 ) || count < 1 ) {
    throw 'getUniqueRandomIntsWithLimit expects limit to be positive integer';
  }

  if ( 'number' !== typeof min ) {
    min = 0;
  } else {
    if ( min !== parseInt( min, 10 ) || min < 1 ) {
      throw 'getUniqueRandomIntsWithLimit expects min to be a positive integer';
    }
  }

  if ( count + min > limit ) {
    throw 'insufficient list size';
  }

  // generate a list of ints between min and limit to represent indices
  var availableInts = this.generateLinearNumericArray( limit, min );
  // randomly pop $count values out of the array and insert into return array
  for ( var i = 0, nextIndex; i < count; i++ ) {
    nextIndex = this.getRandomIntWithLimit( availableInts.length );
    randomNumArray.push( availableInts[ nextIndex ] );
    availableInts.splice( nextIndex, 1 );
  }
  return randomNumArray;
};

/* ==============
   pwGeneratorKeyboard Class
   ============== */

// store a mobile keyboard layout
// @param - id - string - required - unique system name
// @param - label - string - required - human language name
// @return - new pwGeneratorKeyboard
var pwGeneratorKeyboard = function ( id, label ) {
  'use strict';
  // validate params
  if ( !id || !label || 'string' !== typeof id || 'string' !== typeof label ) {
    throw 'pwGeneratorKeyboard requires a valid id and label';
  }
  this.id = id;
  this.label = label;
  this.contexts = [];
  this.currentContext = null;
  this.util = new pwGeneratorUtil();
};

// add/update context in lists of contexts
// @param - id - string - required - unqiue id
// @param - characters - Array[char] - list of available characters
// @param - next - Array[string] - list of ids of next possible contexts
// @return - true
pwGeneratorKeyboard.prototype.addContext = function ( id, characters, next ) {
  'use strict';
  // validate params
  if ( !id || 'string' !== typeof id ) {
    throw 'Invalid parameter. id must be a string.';
  }
  if ( !characters || 'object' !== typeof characters || !characters.length ) {
    throw 'Invalid parameter. characters must be an array of strings';
  }
  // loose check that characters is a list of single character strings
  for ( var j = 0, k = characters.length; j < k; j++ ) {
    if ( !characters[ j ] || 'string' !== typeof characters[ j ] || 1 !== characters[ j ].length ) {
      throw 'Invalid parameter. characters must be an array of strings';
    }
  }
  if ( !next || 'object' !== typeof next || !next.length ) {
    throw 'Invalid parameter. next must be an array of strings';
  }
  for ( var l = 0, m = next.length; l < m; l++ ) {
    if ( !next[ l ] || 'string' !== typeof next[ l ] ) {
      throw 'Invalid parameter. next must be an array of strings';
    }
  }

  var context = {
    id: id,
    characters: characters,
    next: next
  };

  // if this context id is taken, update the existing entry
  for ( var i = 0, len = this.contexts.length; i < len; i++ ) {
    if ( this.contexts[ i ].id === id ) {
      this.contexts[ i ] = context;
      return true;
    }
  }

  // add context to array
  this.contexts.push( context );

  // set a default context if none is set
  if ( this.currentContext === null ) {
    this.currentContext = context;
  }
  return true;
};

// return count of characters in current context
// @return - uint or false if no current context
pwGeneratorKeyboard.prototype.getCharacterCount = function () {
  'use strict';
  if ( this.currentContext ) {
    return this.currentContext.characters.length;
  }
  return false;
};

// return context with given id
// @param - id - string - required
// @return - context object with given id
pwGeneratorKeyboard.prototype.getContextById = function ( id ) {
  'use strict';
  for ( var i = 0, len = this.contexts.length; i < len; i++ ) {
    if ( id === this.contexts[ i ].id ) {
      return this.contexts[ i ];
    }
  }
  throw 'Keyboard with supplied id does not exist';
};

// return value from character array at index
// @param - index - uint - required
// @return - char from list
pwGeneratorKeyboard.prototype.getCharacterAtIndex = function ( index ) {
  'use strict';
  if ( index < this.getCharacterCount() ) {
    return this.currentContext.characters[ index ];
  }
  throw 'Index out of bounds';
};

// return next "random" character
// @return - char from current context
pwGeneratorKeyboard.prototype.getNextCharacter = function () {
  'use strict';
  return this.getCharacterAtIndex( this.util.getRandomIntWithLimit( this.currentContext.characters.length ) );
};

// choose next context and replace current context with it
// @return - void
pwGeneratorKeyboard.prototype.nextContext = function () {
  'use strict';
  if ( this.currentContext.next && this.currentContext.next.length ) {
    var nextIndex = this.util.getRandomIntWithLimit( this.currentContext.next.length );
    var nextConextId = this.currentContext.next[ nextIndex ];
    this.currentContext = this.getContextById( nextConextId );
  } else {
    throw 'no available context';
  }
};

// sets current context to first context in list
// @return - void
pwGeneratorKeyboard.prototype.resetContext = function () {
  'use strict';
  if ( this.contexts && this.contexts.length ) {
    this.currentContext = this.contexts[ 0 ];
  }
};

/* ==============
   pwGenerator Class
   ============== */

// generate passwords based on optimized keyboard context switching
// @return - new pwGenerator
var pwGenerator = function () {
  'use strict';
  this.util = new pwGeneratorUtil();
  this.reset();

  // initialize keyboards
  this.keyboards = [];
  this.addiPhoneKeyboad();
};

// creates default keyboard, adds contexts to keyboard, and adds to keyboard list
// @return - void
pwGenerator.prototype.addiPhoneKeyboad = function () {
  'use strict';
  var iPhoneKeyboard = new pwGeneratorKeyboard( 'iphone456', 'iPhone 4/5/6' );
  iPhoneKeyboard.addContext( 'alpha_lowercase', [ 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm' ], [ 'alpha_uppercase' ] );
  iPhoneKeyboard.addContext( 'alpha_uppercase', [ 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M' ], [ 'symbol_1' ] );
  iPhoneKeyboard.addContext( 'symbol_1', [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '/', ':', ';', '(', ')', '$', '&', '@', '"', '.', ',', '?', '!', '\'' ], [ 'alpha_lowercase', 'symbol_1' ] );
  iPhoneKeyboard.addContext( 'symbol_2', [ '[', ']', '{', '}', '#', '%', '^', '*', '+', '=', '_', '\\', '|', '~', '<', '>', '€', '£', '¥', '•', '.', ',', '?', '!', '`' ], [ 'alpha_lowercase', 'symbol_1' ] );
  this.addKeyboard( iPhoneKeyboard );
};

// return keyboard object from id if exists
// @param - id - string - required
// @return - pwGeneratorKeyboard
pwGenerator.prototype.getKeyboardById = function ( id ) {
  'use strict';
  for ( var i = 0, len = this.keyboards.length; i < len; i++ ) {
    if ( id === this.keyboards[ i ].id ) {
      return this.keyboards[ i ];
    }
  }
  throw 'Keyboard with supplied id does not exist';
};

// append or replace keyboard to list of keyboards
// @param - keyboard - pwGeneratorKeyboard - required
// @return - true
pwGenerator.prototype.addKeyboard = function ( keyboard ) {
  'use strict';
  if ( keyboard.constructor !== pwGeneratorKeyboard ) {
    throw 'pwGenerator expects pwGeneratorKeyboard type';
  }

  // if keyboard with matching id already exists, replace it
  for ( var i = 0, len = this.keyboards.length; i < len; i++ ) {
    if ( keyboard.id === this.keyboards[ i ].id ) {
      this.keyboards[ i ] = keyboard;
      return true;
    }
  }

  this.keyboards.push( keyboard );
  return true;
};

// setter method
// @param - keyboardId - string - required - id of keyboard that has been added
// @return - void
pwGenerator.prototype.setCurrentKeyboard = function ( keyboardId ) {
  'use strict';
  this.currentKeyboard = this.getKeyboardById( keyboardId );
  this.currentKeyboard.resetContext();
};

// resets state
// @return - void
pwGenerator.prototype.reset = function () {
  'use strict';
  this.currentIndex = 0;
  this.password = '';
  this.htmlPassword = '';
  this.currentKeyboard = null;
};

// return a password
// @param - charLen - uint - required
// @param - keyboardId - string - required
pwGenerator.prototype.generatePassword = function ( charLen, keyboardId ) {
  'use strict';
  // reset persistent data
  this.reset();

  // number of times to switch contexts during password generation.
  // May make sense to expose this under a "Password Strength toggle"
  var numContextSwitches = 2;

  // make selected keyboard readily available
  this.setCurrentKeyboard( keyboardId );

  // generate list of indices where we will switch keyboard context
  // starting from the second index,
  var contextSwitchIndices = this.util.getUniqueRandomIntsWithLimit( charLen, numContextSwitches, 1 );

  this.htmlPassword = '<span class="password-segment">';

  var nextChar = '';
  while ( this.password.length < charLen ) {
    // if current index matches a value in the context switch index array,
    // move forward in the array.
    for ( var i = 0; i < numContextSwitches; i++ ) {
      if ( contextSwitchIndices[ i ] === this.currentIndex ) {
        this.currentKeyboard.nextContext();
        this.htmlPassword += '</span><span class="password-segment">';
      }
    }
    nextChar = this.currentKeyboard.getNextCharacter();
    this.password += nextChar;
    this.htmlPassword += nextChar;
    this.currentIndex++;
  }
  this.htmlPassword += '</span>';
  //document.getElementById('view').innerHTML = this.htmlPassword;
  
  return this.password;
};
