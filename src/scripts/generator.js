import { getUniqueRandomIntsWithLimit } from "./random";

class PasswordGenerator {
  constructor() {
    this.keyboards = {};
  }

  addKeyboard(keyboard) {
    this.keyboards[keyboard.id] = keyboard;
  }

  /**
   * Generate a password
   *
   * Creates a list of character indices at which the context should switch.
   * Creates a password using characters from the current context, and
   * switches contexts at the preset indices.
   */
  generatePassword(charLen, keyboardId, contextSwitchCount) {
    const currentKeyboard = this.keyboards[keyboardId];
    const switchIndices = getUniqueRandomIntsWithLimit(
      charLen,
      contextSwitchCount,
      2
    );
    let password = "";
    while (password.length < charLen) {
      if (switchIndices.includes(password.length)) {
        currentKeyboard.nextContext();
      }
      password += currentKeyboard.getRandomCharacter();
    }
    return password;
  }
}

export default PasswordGenerator;
