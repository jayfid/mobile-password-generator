import { checkVisible, scrollIntoView } from "./ui";

// Number of times to switch contexts during password generation.
// May make sense to expose this under a "Password Strength toggle"
const PASSWORD_CONTEXT_SWITCHES = 2;

const focusPasswordField = () => {
  const passwordInput = document.querySelector("#password");
  passwordInput.removeAttribute("readonly");
  passwordInput.focus();
  passwordInput.setSelectionRange(0, 999);
  passwordInput.setAttribute("readonly", "readonly");
};

export const generateAndDisplayPassword = () => {
  const charLen = document.querySelector("#charlen").value;
  const keyboardId = document.querySelector("#keyboard").value;

  if (!charLen || !keyboardId) {
    return;
  }
  const newpass = window.passwordGenerator.generatePassword(
    charLen,
    keyboardId,
    PASSWORD_CONTEXT_SWITCHES
  );
  document.querySelector("#password")?.setAttribute("value", newpass);
};

export const submitPasswordForm = () => {
  const pwElem = document.querySelector("#password");
  if (!checkVisible(pwElem)) {
    scrollIntoView(pwElem, "bottom");
  }
  generateAndDisplayPassword();
  focusPasswordField();
};

export const generateAndCopy = () => {
  document.activeElement.blur();
  submitPasswordForm();
  document.querySelector("#password-field").click();
};
