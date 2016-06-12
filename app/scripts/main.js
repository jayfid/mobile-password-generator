// set up password generation
(function() {
  'use strict';
  submitPasswordForm();
  var generateButton = document.getElementById('generate');
  generateButton.addEventListener('click', submitPasswordForm);
})();

function submitPasswordForm() {
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
