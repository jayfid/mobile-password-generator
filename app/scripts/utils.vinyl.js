/**
 ** Utility functions.
 */
function toggleClass(element, elemClass) {
  'use strict';
  if (!element || !elemClass) {
    return false;
  }
  if (hasClass(element, elemClass)) {
    return removeClass(element, elemClass);
  } else {
    return addClass(element, elemClass);
  }
}

function hasClass(element, elemClass) {
  'use strict';
  if (typeof element.className === 'string') {
    if (element.className === elemClass) {
      return true;
    }
    if (!element.className.match(elemClass)) {
      return false;
    }
    var found = false,
      classes = element.className.split(' ');
    for (var i = 0, len = classes.length; !found && i < len; i++) {
      if (classes[i] === elemClass) {
        found = true;
      }
    }
    return found;
  }
  return false;
}

function addClass(element, elemClass) {
  'use strict';
  if (typeof element.className !== 'undefined') {
    if (hasClass(element, elemClass)) {
      return true;
    }
    element.className += ' ' + elemClass;
    return true;
  }
  return false;
}

function removeClass(element, elemClass) {
  'use strict';
  if (typeof element.className !== 'undefined') {
    if (hasClass(element, elemClass)) {
      var found = false,
        index = false,
        classes = element.className.split(' ');
      for (var i = 0, len = classes.length; !found && i < len; i++) {
        if (classes[i] === elemClass) {
          found = true;
          index = i;
        }
      }
      classes.splice(index, 1);
      element.className = classes.join(' ');
      return true;
    }
  }
  return false;
}

function findParentWithClass(element, elemClass, limit) {
  'use strict';
  var found = false,
    count = 0;
  if (!limit) {
    limit = 100;
  }
  while (element !== null && !found && count < limit) {
    if (element.tagName === 'BODY') {
      // we've gone too far!
      return false;
    }
    if (typeof element.className !== 'undefined') {
      if (hasClass(element, elemClass)) {
        found = element;
      } else {
        element = element.parentNode;
      }
    }
    count++;
  }
  return found;
}

function findParentLink(element, limit) {
  'use strict';
  var found = false,
    count = 0;
  if (!limit) {
    limit = 100;
  }
  while (element !== null && !found && count < limit) {
    if (element.tagName === 'BODY') {
      // we've gone too far!
      return false;
    }
    if (element.localName === 'a') {
      found = element;
    } else {
      element = element.parentNode;
    }
    count++;
  }
  return found;
}

function findFirstChild(node) {
  'use strict';
  var firstChild = node.firstChild;
  while (firstChild !== null && firstChild.nodeType == 3) {
    firstChild = firstChild.nextSibling;
  }
  return firstChild;
}

function getParam(param) {
  'use strict';
  var search = window.location.search.substring(1);
  var compareKeyValuePair = function(pair) {
    var key_value = pair.split('=');
    var decodedKey = decodeURIComponent(key_value[0]);
    var decodedValue = decodeURIComponent(key_value[1]);
    if (decodedKey == param) {
      return decodedValue;
    }
    return null;
  };

  var comparisonResult = null;

  if (search.indexOf('&') > -1) {
    var params = search.split('&');
    for (var i = 0; i < params.length; i++) {
      comparisonResult = compareKeyValuePair(params[i]);
      if (comparisonResult !== null) {
        break;
      }
    }
  } else {
    comparisonResult = compareKeyValuePair(search);
  }
  return comparisonResult;
}

// credit - http://stackoverflow.com/a/24829409
function getPosition(element) {
  'use strict';
  var xPosition = 0;
  var yPosition = 0;

  while (element) {
    xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
    yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
    element = element.offsetParent;
  }

  return {
    x: xPosition,
    y: yPosition
  };
}

function scrollIntoView(elem, position) {
  'use strict';

  var currentWindowYOffset = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
  var elementWindowYOffset;
  if (position && position === 'bottom') {
    var elemY = getPosition(elem).y + currentWindowYOffset;
    var elemHeight = elem.offsetHeight;
    var elemBottomPixel = elemY + elemHeight;
    var extraSpacePixels = 30;
    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var calculatedOffset = elemBottomPixel - windowHeight + extraSpacePixels;
    elementWindowYOffset = (calculatedOffset >= 0) ? calculatedOffset : 0;
  } else {
    elementWindowYOffset = getPosition(elem).y;
  }

  var initialWindowYOffset = currentWindowYOffset;

  if (initialWindowYOffset === elementWindowYOffset) {
    return;
  }
  var interval = window.setInterval(function() {
    if (currentWindowYOffset !== elementWindowYOffset) {
      var offset = 1;
      var distance = Math.abs(currentWindowYOffset - elementWindowYOffset);
      if (distance < 10) {
        offset = distance;
      } else {
        offset += Math.floor(Math.sqrt(distance));
      }

      if (currentWindowYOffset > elementWindowYOffset) {
        currentWindowYOffset -= offset;
      } else {
        currentWindowYOffset += offset;
      }
      window.scrollTo(0, currentWindowYOffset);
    } else {
      window.clearInterval(interval);
    }
  }, 25);
}
