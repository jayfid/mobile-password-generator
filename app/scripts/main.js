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

  // iOS does not allow copying via js
  if ( !iOS() ) {
    removeClass(document.getElementsByClassName('action')[0], 'hide');

    // create a shortcut button to generate the pw and copy it at the same time
    var copyAndGenBtn = document.createElement('button');
    copyAndGenBtn.setAttribute('type', 'button');
    copyAndGenBtn.setAttribute('id', 'generate-copy');
    copyAndGenBtn.className = 'btn-style-a';
    copyAndGenBtn.innerHTML = 'Generate and Copy to Clipboard';
    copyAndGenBtn.addEventListener( 'click', generateAndCopy );
    document.getElementsByClassName('button-group')[0].appendChild(copyAndGenBtn);

  // Clipboard

    var clipboard = new Clipboard( '#password-field' );
    clipboard.on( 'success', showCopySuccess );
    clipboard.on( 'error', showCopyError );
  }
  else {
    document.getElementById('password-field').addEventListener('click', focusPasswordField);
  }

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

function focusPasswordField() {
  'use strict';
  var passwordInput = document.getElementById('password');
  passwordInput.removeAttribute('readonly');
  passwordInput.focus();
  passwordInput.setSelectionRange(0, 999);
  passwordInput.setAttribute('readonly', 'readonly');
}

function generateAndCopy() {
  'use strict';
  document.activeElement.blur();
  submitPasswordForm();
  document.getElementById( 'password-field' ).click();
}

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
  focusPasswordField();
}

function updatePasswordField( text ) {
  'use strict';
  var passwordInput = document.getElementById( 'password' );
  if ( passwordInput ) {
    passwordInput.setAttribute( 'value', text );
  }
}
