// set up password generation
( function () {
  'use strict';

  // Selects
  var selects = document.getElementsByClassName( 'select-style' );
  for ( var i = 0; i < selects.length; i++ ) {
    new vinylSelect( selects[ i ] );
  }

  // Buttons
  var generateButton = document.getElementById( 'generate' );
  generateButton.addEventListener( 'click', submitPasswordForm );
  var generateAndCopyButton = document.getElementById( 'generate-copy' );
  generateAndCopyButton.addEventListener( 'click', function () {
    // reset focus on mobile devices
    document.activeElement.blur();
    submitPasswordForm();
    document.getElementById( 'password-field' ).click();
  } );

  // Clipboard
  var clipboard = new Clipboard( '#password-field' );
  clipboard.on( 'success', showCopySuccess );
  clipboard.on( 'error', showCopyError );

  // Cookies
  if ( window.Cookies ) {
    document.body.addEventListener( 'vinylSelectUpdate', function ( e ) {
      var options = {
        charlen: document.getElementById( 'charlen' ).value,
        keyboard: document.getElementById( 'keyboard' ).value
      };
      Cookies.set( 'mpg_options', JSON.stringify( options ) );
    } );
    initializeOptions();
  }

  // Password
  generateAndDisplayPassword();
} )();

function initializeOptions() {
  'use strict';
  var initialOptions = Cookies.get( 'mpg_options' );
  if ( initialOptions ) {
    var initialOptionsObj = JSON.parse( initialOptions );
    var foundElem = null;
    for ( var j in initialOptionsObj ) {
      foundElem = document.getElementById( j );
      if ( foundElem && foundElem.tagName === 'INPUT' ) {
        foundElem.vinylSelect.setValue( initialOptionsObj[ j ] );
      }
    }
  }
}

function showCopyError() {
  'use strict';
  // show text to encourage manual copying
  addClass( document.getElementsByClassName( 'copy-error' )[ 0 ], 'show' );
}

function showCopySuccess() {
  'use strict';
  toggleClass( document.getElementsByClassName( 'copy-alert' )[ 0 ], 'slide' );
}

function generateAndDisplayPassword() {
  'use strict';
  var charLenInput = document.getElementById( 'charlen' ),
    keyboardInput = document.getElementById( 'keyboard' ),
    passwordInput = document.getElementById( 'password' );

  if ( charLenInput && keyboardInput && passwordInput ) {
    window.passwordGenerator = window.passwordGenerator || new pwGenerator();
    var charLen = charLenInput.value;
    var keyboardId = keyboardInput.value;
    if ( charLen && keyboardId ) {
      var newpass = window.passwordGenerator.generatePassword( charLen, keyboardId );
      updatePasswordField( newpass );
    }
  }
}

function submitPasswordForm() {
  'use strict';
  removeClass( document.getElementsByClassName( 'copy-error' )[ 0 ], 'show' );
  var pwElem = document.getElementById( 'password' );
  if ( !checkVisible( pwElem ) ) {
    scrollIntoView( pwElem, 'bottom' );
  }
  generateAndDisplayPassword();
}

function updatePasswordField( text ) {
  'use strict';
  var passwordInput = document.getElementById( 'password' );
  if ( passwordInput ) {
    passwordInput.setAttribute( 'value', text );
  }
}
