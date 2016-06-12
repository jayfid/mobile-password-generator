var VinylSelect = function () {
  'use strict';
  this.select_style = arguments[0];
  this.init();
};

VinylSelect.prototype.init = function () {
  'use strict';
  var default_text = this.select_style.getElementsByClassName('select-style-default');
  if ( default_text.length ) {
    this.select_style.getElementsByClassName('select-style-value')[0].innerHTML = default_text[0].innerHTML;
    default_text[0].style.display = 'none';
  }

  return this;
};

VinylSelect.prototype.clickInit = function () {
  'use strict';
  var select_inner = findFirstChild(this.select_style);
  jQuery(select_inner).click(function () {
    jQuery(this).next().toggleClass('show');
  });
};

VinylSelect.prototype.changeInit = function () {
  'use strict';
  var select_style = this.select_style;
  jQuery(jQuery(this.select_style).find('li')).click(function() {
    var newVal = this.getAttribute('data-value');
    // set hidden input value
    var select_style_value = select_style.getElementsByClassName('select-style-input');
    if (select_style_value.length) {
      select_style_value[0].value = newVal;
    }
    //replace display text
    findFirstChild(findFirstChild(select_style)).innerHTML = this.innerHTML;
    //close menu
    jQuery(jQuery(select_style).find('.select-style-options')).removeClass('show');

  });
};
