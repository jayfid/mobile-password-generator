import PasswordGenerator from "./generator";

function updatePasswordField(text) {
  document.querySelector("#password")?.setAttribute("value", text);
}

export function focusPasswordField() {
  const passwordInput = document.getElementById("password");
  passwordInput.removeAttribute("readonly");
  passwordInput.focus();
  passwordInput.setSelectionRange(0, 999);
  passwordInput.setAttribute("readonly", "readonly");
}

export function generateAndDisplayPassword() {
  const charLenInput = document.querySelector("#charlen");
  const keyboardInput = document.querySelector("#keyboard");
  const passwordInput = document.querySelector("#password");

  if (charLenInput && keyboardInput && passwordInput) {
    if (!window.passwordGenerator) {
      window.passwordGenerator = new PasswordGenerator();
    }
    const charLen = charLenInput.value;
    const keyboardId = keyboardInput.value;
    if (charLen && keyboardId) {
      const newpass = window.passwordGenerator.generatePassword(
        charLen,
        keyboardId
      );
      updatePasswordField(newpass);
    }
  }
}

// credit - http://stackoverflow.com/a/5354536
function checkVisible(elm) {
  const rect = elm.getBoundingClientRect();
  const viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

// credit - http://stackoverflow.com/a/24829409
function getPosition(element) {
  let xPosition = 0;
  let yPosition = 0;
  let localElement = element;

  while (localElement) {
    xPosition += element.offsetLeft - element.scrollLeft + element.clientLeft;
    yPosition += element.offsetTop - element.scrollTop + element.clientTop;
    localElement = element.offsetParent;
  }

  return {
    x: xPosition,
    y: yPosition,
  };
}

function scrollIntoView(elem, position) {
  const offsetTop = window.pageYOffset || document.documentElement.scrollTop;
  const docTop = document.documentElement.clientTop || 0;
  let currentWindowYOffset = offsetTop - docTop;
  let elementWindowYOffset;
  if (position && position === "bottom") {
    const elemY = getPosition(elem).y + currentWindowYOffset;
    const elemHeight = elem.offsetHeight;
    const elemBottomPixel = elemY + elemHeight;
    const extraSpacePixels = 30;
    const windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    const calculatedOffset = elemBottomPixel - windowHeight + extraSpacePixels;
    elementWindowYOffset = calculatedOffset >= 0 ? calculatedOffset : 0;
  } else {
    elementWindowYOffset = getPosition(elem).y;
  }

  if (currentWindowYOffset === elementWindowYOffset) {
    return;
  }
  const interval = window.setInterval(() => {
    if (currentWindowYOffset !== elementWindowYOffset) {
      let offset = 1;
      const distance = Math.abs(currentWindowYOffset - elementWindowYOffset);
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

export function submitPasswordForm() {
  document.querySelector(".copy-error").classList.remove("remove");
  const pwElem = document.querySelector("#password");
  if (!checkVisible(pwElem)) {
    scrollIntoView(pwElem, "bottom");
  }
  generateAndDisplayPassword();
  focusPasswordField();
}

export function generateAndCopy() {
  document.activeElement.blur();
  submitPasswordForm();
  document.querySelector("#password-field").click();
}

// show text to encourage manual copying
export function showCopyError() {
  document.querySelector(".copy-error").classList.add("show");
}

export function showCopySuccess() {
  document.querySelector(".copy-alert").classList.toggle("slide");
}

// credit - http://stackoverflow.com/a/9039885
export function iOS() {
  const iDevices = [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod",
  ];
  if (navigator.platform) {
    while (iDevices.length) {
      if (navigator.platform === iDevices.pop()) {
        return true;
      }
    }
  }
  return false;
}
