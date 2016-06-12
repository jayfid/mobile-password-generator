// set up password generation
(function() {
  'use strict';
  generateAndDisplayPassword();
  var generateButton = document.getElementById('generate');
  generateButton.addEventListener('click', submitPasswordForm);

  var clipboard = new Clipboard('#password-field');

  clipboard.on('success', function() {
    // display "Copied" Message

  });
})();

function generateAndDisplayPassword() {
  'use strict';
  var charLenInput = document.getElementById('charlen'),
  keyboardInput = document.getElementById('keyboard'),
  passwordInput = document.getElementById('password');

  if (charLenInput && keyboardInput && passwordInput) {
      window.passwordGenerator =  window.passwordGenerator || new pwGenerator();
      var charLen = charLenInput.options[charLenInput.selectedIndex].value;
      var keyboardId = keyboardInput.options[keyboardInput.selectedIndex].value;
      if (charLen && keyboardId) {
        var newpass = window.passwordGenerator.generatePassword(charLen, keyboardId);
        updatePasswordField(newpass);
      }
  }
}

function submitPasswordForm() {
  'use strict';
  scrollIntoView(document.getElementById('password'), 'bottom');
  generateAndDisplayPassword();
}

function updatePasswordField(text) {
  var passwordInput = document.getElementById('password');
  if (passwordInput) {
    passwordInput.setAttribute('value', text);
  }
}

// set up select fields
(function() {
  'use strict';
    // Select elements
    var selects = document.getElementsByClassName('select-style');
    for ( var i = 0; i < selects.length; i++ ) {
      var this_select = new VinylSelect(selects[i]);
      this_select.clickInit();
      this_select.changeInit();
    }
})();
