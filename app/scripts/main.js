// set up password generation
(function(win) {
  'use strict';
  win.pwGenerator = new pwGenerator();
})(window);

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
