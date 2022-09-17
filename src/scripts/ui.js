import iPhoneKeyboard from "./layouts/iphone";
import PasswordGenerator from "./generator";

// Number of times to switch contexts during password generation.
// May make sense to expose this under a "Password Strength toggle"
const PASSWORD_CONTEXT_SWITCHES = 2;

function updatePasswordField(text) {
  document.querySelector("#password")?.setAttribute("value", text);
}

function focusPasswordField() {
  const passwordInput = document.querySelector("#password");
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
      window.passwordGenerator.addKeyboard(iPhoneKeyboard);
    }
    const charLen = charLenInput.value;
    const keyboardId = keyboardInput.value;
    if (charLen && keyboardId) {
      const newpass = window.passwordGenerator.generatePassword(
        charLen,
        keyboardId,
        PASSWORD_CONTEXT_SWITCHES
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

export function showCopySuccess() {
  document.querySelector(".copy-alert").classList.toggle("slide");
}
