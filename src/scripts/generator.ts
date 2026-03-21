import type KeyboardLayout from "./keyboard";
import { getUniqueRandomIntsWithLimit } from "./random";

class PasswordGenerator {
  keyboards: Record<string, KeyboardLayout>;

  constructor() {
    this.keyboards = {};
  }

  addKeyboard(keyboard: KeyboardLayout): void {
    this.keyboards[keyboard.id] = keyboard;
  }

  /**
   * Generate a password
   *
   * Creates a list of character indices at which the context should switch.
   * Creates a password using characters from the current context, and
   * switches contexts at the preset indices.
   */
  generatePassword(
    charLen: number,
    keyboardId: string,
    contextSwitchCount: number,
  ): string {
    const currentKeyboard = this.keyboards[keyboardId];
    if (!currentKeyboard) {
      throw Error("Keyboard with supplied id does not exist");
    }
    const switchIndices = getUniqueRandomIntsWithLimit(
      charLen,
      contextSwitchCount,
      2,
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
