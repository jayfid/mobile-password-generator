var VinylSelect = function() {
  'use strict';
  this.select_style = arguments[0];
  addClass(this.select_style, 'processed-select-style');
  // TODO - avoid unexpected undefined's
  this.hidden_elem = this.select_style.getElementsByClassName('select-style-input')[0];
  this.hidden_elem.vinylSelect = this;

  this.default_value = this.select_style.getElementsByClassName('select-style-default')[0];
  this.display_text = this.select_style.getElementsByClassName('select-style-value')[0];

  this.open = false;

  this.updateValue(this.default_value);

  this.init();

  this.clickInit();
  this.changeInit();
};

VinylSelect.prototype.updateValue = function(option) {
  'use strict';
  this.hidden_elem.value = option.getAttribute('data-value');
  this.display_text.innerHTML = option.innerHTML;
  var options = this.select_style.getElementsByTagName('p');
  for (var i = 0, len = options.length; i < len; i++) {
    removeClass(options[i], 'select-style-default');
  }
  addClass(option, 'select-style-default');
};

VinylSelect.prototype.setValue = function(value) {
  var options = this.select_style.getElementsByTagName('p');
  for (var i = 0, len = options.length; i < len; i++) {
    if (value === options[i].getAttribute('data-value')) {
      this.updateValue(options[i]);
    }
  }
}

VinylSelect.prototype.init = function() {
  'use strict';
  var default_text = this.select_style.getElementsByClassName('select-style-default');
  if (default_text.length) {
    this.select_style.getElementsByClassName('select-style-value')[0].innerHTML = default_text[0].innerHTML;
  }
  return this;
};

VinylSelect.prototype.close = function() {
  'use strict';
  removeClass(this.select_style, 'show');
};

VinylSelect.prototype.clickInit = function() {
  'use strict';
  var select_style = this.select_style;
  var self = this;

  this.select_style.getElementsByClassName('select-style-inner')[0].addEventListener('click', function() {
    toggleClass(select_style, 'show');
    self.open = hasClass(select_style, 'show');
    if (self.open) {
      document.body.addEventListener('click', handleClickWhileOpen, true);
    } else {
      document.body.removeEventListener('click', handleClickWhileOpen, true);
    }
  });
};

function handleClickWhileOpen(e) {
  'use strict';
  var parent_found = findParentWithClass(e.target, 'processed-select-style');
  if (!parent_found) {
    var selects = document.getElementsByClassName('processed-select-style');
    for (var i = 0, len = selects.length; i < len; i++) {
      removeClass(selects[i], 'show');
    }
    document.body.removeEventListener('click', handleClickWhileOpen, true);
  }
}

VinylSelect.prototype.changeInit = function() {
  'use strict';
  var self = this;
  var handlerFunction = function(e) {
    self.updateValue(e.target);
    self.close();
    var event = document.createEvent('Event');
    event.initEvent('vinylSelectUpdate', true, true);
    document.body.dispatchEvent(event);
  };

  var options = this.select_style.getElementsByTagName('p');
  for (var i = 0, len = options.length; i < len; i++) {
    options[i].addEventListener('click', handlerFunction);
  }
};

VinylSelect.prototype.getValue = function() {
  'use strict';
  return this.hidden_elem.value;
};
