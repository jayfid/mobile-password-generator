// set up password generation
(function() {
  'use strict';

  // Selects
  var selects = document.getElementsByClassName('select-style');
  for (var i = 0; i < selects.length; i++) {
    new VinylSelect(selects[i]);
  }

  // Buttons
  var generateButton = document.getElementById('generate');
  generateButton.addEventListener('click', submitPasswordForm);
  var generateAndCopyButton = document.getElementById('generate-copy');
  generateAndCopyButton.addEventListener('click', function() {
    submitPasswordForm();
    document.getElementById('password-field').click();
  });

  // Clipboard
  var clipboard = new Clipboard('#password-field');
  clipboard.on('success', showCopySuccess);

  // Cookies
  if (window.Cookies) {
    document.body.addEventListener('vinylSelectUpdate', function(e) {
      var options = {
        charlen: document.getElementById('charlen').value,
        keyboard: document.getElementById('keyboard').value
      };
      console.log('saving cookie');
      Cookies.set('mpg_options', JSON.stringify(options));
    });
    var initialOptions = JSON.parse(Cookies.get('mpg_options'));
    console.log('initial cookie', initialOptions);
    if (initialOptions) {
      for (var j in initialOptions) {
        document.getElementById(j).vinylSelect.setValue(initialOptions[j]);
      }
    }
  }

  // Password
  generateAndDisplayPassword();
})();

function showCopySuccess() {
  'use strict';
  toggleClass(document.getElementsByClassName('copy-alert')[0], 'slide');
}

function generateAndDisplayPassword() {
  'use strict';
  var charLenInput = document.getElementById('charlen'),
    keyboardInput = document.getElementById('keyboard'),
    passwordInput = document.getElementById('password');

  if (charLenInput && keyboardInput && passwordInput) {
    window.passwordGenerator = window.passwordGenerator || new pwGenerator();
    var charLen = charLenInput.value;
    var keyboardId = keyboardInput.value;
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
  'use strict';
  var passwordInput = document.getElementById('password');
  if (passwordInput) {
    passwordInput.setAttribute('value', text);
  }
}
