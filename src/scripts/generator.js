import iPhoneKeyboard from "./layouts/iphone";
import { getUniqueRandomIntsWithLimit } from "./random";

class PasswordGenerator {
  constructor() {
    this.keyboards = [];
    this.currentKeyboard = null;
    this.addKeyboard(iPhoneKeyboard);
  }

  getKeyboardById(id) {
    for (let i = 0, len = this.keyboards.length; i < len; i += 1) {
      if (id === this.keyboards[i].id) {
        return this.keyboards[i];
      }
    }
    throw Error("Keyboard with supplied id does not exist");
  }

  addKeyboard(keyboard) {
    for (let i = 0, len = this.keyboards.length; i < len; i += 1) {
      if (keyboard.id === this.keyboards[i].id) {
        this.keyboards[i] = keyboard;
        return;
      }
    }

    this.keyboards.push(keyboard);
  }

  // create and show a password
  /**
   * Generate a password
   *
   * Creates a list of character indices at which the context should switch.
   * Creates a password using characters from the current context, and
   * switches contexts at the preset indices.
   */
  generatePassword(charLen, keyboardId, contextSwitchCount) {
    const currentKeyboard = this.getKeyboardById(keyboardId);
    const switchIndices = getUniqueRandomIntsWithLimit(
      charLen,
      contextSwitchCount,
      1
    );
    let password = "";
    while (password.length < charLen) {
      if (switchIndices.includes(password.length)) {
        currentKeyboard.nextContext();
      }
      password += currentKeyboard.getNextCharacter();
    }
    return password;
  }
}

export default PasswordGenerator;
