import { checkVisible, scrollIntoView } from "./ui";

// Number of times to switch contexts during password generation.
// May make sense to expose this under a "Password Strength toggle"
const PASSWORD_CONTEXT_SWITCHES = 3;

const getRequiredElement = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw Error(`Required element not found: ${selector}`);
  }
  return element;
};

const focusPasswordField = (): void => {
  const passwordInput = getRequiredElement<HTMLInputElement>("#password");
  passwordInput.removeAttribute("readonly");
  passwordInput.focus();
  passwordInput.setSelectionRange(0, 999);
  passwordInput.setAttribute("readonly", "readonly");
};

export const generateAndDisplayPassword = (): void => {
  const charLen = Number.parseInt(
    getRequiredElement<HTMLInputElement>("#charlen").value,
    10,
  );
  const keyboardId = getRequiredElement<HTMLInputElement>("#keyboard").value;

  if (Number.isNaN(charLen) || !keyboardId || !window.passwordGenerator) {
    return;
  }
  const newpass = window.passwordGenerator.generatePassword(
    charLen,
    keyboardId,
    PASSWORD_CONTEXT_SWITCHES,
  );
  getRequiredElement<HTMLInputElement>("#password").value = newpass;
};

export const submitPasswordForm = (): void => {
  const pwElem = getRequiredElement<HTMLInputElement>("#password");
  if (!checkVisible(pwElem)) {
    scrollIntoView(pwElem, "bottom");
  }
  generateAndDisplayPassword();
  focusPasswordField();
};

export const generateAndCopy = (): void => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  submitPasswordForm();
  getRequiredElement<HTMLElement>("#password-field").click();
};
